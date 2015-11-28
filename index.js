'use strict';

let nconf = require('nconf');
let koa = require('koa');
let router = require('koa-router')();
let handlebars = require('koa-handlebars');
let request = require('superagent-bluebird-promise');
let app = koa();

let lastFetch = 0;
let img;

nconf.argv().env().file({ file: 'config.json' });

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
    let ts = new Date().getTime();

    let rateLimit = nconf.get('rate_limit') * 1000 || 60000;
    let baseUrl = nconf.get('base_url');
    let username = nconf.get('user_name');
    let password = nconf.get('password');

    if (ts - lastFetch > rateLimit) {
        let url = `${baseUrl}/CGIProxy.fcgi?cmd=snapPicture2&usr=${username}&pwd=${password}`;
        img = yield request.get(url);
        lastFetch = ts;
    }

    this.body = img.body;
    this.type = 'png';
});

router.get('/', function *(next) {
    yield this.render('index', {
        title: nconf.get('page_title'),
        loading_label: nconf.get('loading_label'),
        refresh_label: nconf.get('refresh_label'),
        image_taken_label: nconf.get('image_taken_label'),
        timestamp: lastFetch === 0 ? new Date().toString() : new Date(lastFetch).toString()
    });
});

let port = nconf.get('node_http_port');

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);

console.log(`Listening at http://localhost:${port}`);
