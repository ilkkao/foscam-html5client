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

    if (ts - lastFetch > nconf.get('rate_limit') * 1000) {
        let url = nconf.get('base_url') +
            '/CGIProxy.fcgi?cmd=snapPicture2&usr=' +
            nconf.get('user_name') +
            '&pwd=' +
            nconf.get('password');

        img = yield request.get(url)
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

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(nconf.get('node_http_port'));
