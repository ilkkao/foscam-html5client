'use strict';

let nconf = require('nconf');
let koa = require('koa');
let router = require('koa-router')();
let handlebars = require('koa-handlebars');
let request = require('superagent-bluebird-promise');
let app = koa();

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

// response

router.get('/snapshot.png', function *(next) {
    let url = nconf.get('base_url') +
        '/CGIProxy.fcgi?cmd=snapPicture2&usr=' +
        nconf.get('user_name') +
        '&pwd=' +
        nconf.get('password');

    console.log(url)

    let img = yield request.get(url)

    this.body = img.body;
    this.type = 'png';
});

router.get('/', function *(next) {
    yield this.render('index', {
        title: nconf.get('page_title'),
        loading_label: nconf.get('loading_label'),
        refresh_label: nconf.get('refresh_label')
    });
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(nconf.get('node_http_port'));
