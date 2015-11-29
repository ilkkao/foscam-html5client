'use strict';

let nconf = require('nconf');
let koa = require('koa');
let router = require('koa-router')();
let handlebars = require('koa-handlebars');
let request = require('superagent-bluebird-promise');
let app = koa();

nconf.argv().env().file({ file: 'config.json' });

let rateLimit = nconf.get('rate_limit') * 1000 || 60000;
let baseUrl = nconf.get('base_url');
let username = nconf.get('user_name');
let password = nconf.get('password');

let lastFetch = 0;
let fetchPending = true;
let img;

app.use(function *(next){
    let start = new Date;
    yield next;
    let ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(handlebars({
    defaultLayout: 'main'
}));

router.get('/snapshot.png', function *(next) {
    if (fetchPending) {
        let url = `${baseUrl}/CGIProxy.fcgi?cmd=snapPicture2&usr=${username}&pwd=${password}`;
        img = yield request.get(url);
        fetchPending = false;
    }

    this.body = img.body;
    this.type = 'png';
});

router.get('/', function *(next) {
    let ts = new Date().getTime();

    if (ts - lastFetch > rateLimit) {
        fetchPending = true;
        lastFetch = ts;
    }

    let parameters = nconf.get();
    parameters.timestamp = lastFetch;
    parameters.fetch_possible = rateLimit - (ts - lastFetch);

    yield this.render('index', parameters);
});

let port = nconf.get('node_http_port');

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);

console.log(`Listening at http://localhost:${port}`);
