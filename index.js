'use strict';

const fs = require('fs');
const path = require('path');
const nconf = require('nconf');
const koa = require('koa');
const preRouter = require('koa-router')();
const router = require('koa-router')();
const handlebars = require('koa-handlebars');
const session = require('koa-session');
const send = require('koa-send');
const mount = require('koa-mount');
const request = require('superagent-bluebird-promise');
const app = koa();

nconf.argv().env().file({ file: 'config.json' });

let rateLimit = nconf.get('rate_limit') * 1000 || 60000;
let baseUrl = nconf.get('base_url');
let username = nconf.get('user_name');
let password = nconf.get('password');

let lastFetch = 0;
let fetchPending = true;
let img;

let hitsFile = path.join(__dirname, '.hits_counter');
let hits = 0;

try {
    hits = fs.readFileSync(hitsFile);
} catch(e) {}

app.keys = [ nconf.get('web_session_secret') ];

app.use(session(app));

app.use(function *(next){
    let start = new Date;
    yield next;
    let ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(handlebars({
    defaultLayout: 'main'
}));

app.use(mount('/assets', function *(next) {
    yield send(this, this.path, { root: __dirname + '/public' });
}));

preRouter.get('/login', function *() {
    this.session.password = this.query.password;
    this.status = 200;
});

app.use(preRouter.routes());

app.use(function *(next) {
    let parameters = nconf.get();

    if (nconf.get('enable_web_password')) {
        if (!this.session.password) {
            yield this.render('password', parameters);
            return;
        } else if (this.session.password !== nconf.get('web_password')) {
            parameters.errorMsg = nconf.get('incorrect_password_label');

            yield this.render('password', parameters);

            this.session.password = '';
            return;
        }
    }

    yield next;
});

router.get('/snapshot.png', function *() {
    if (fetchPending) {
        let url = `${baseUrl}/CGIProxy.fcgi?cmd=snapPicture2&usr=${username}&pwd=${password}`;
        img = yield request.get(url);
        fetchPending = false;
    }

    this.body = img.body;
    this.type = 'png';
});

router.get('/', function *() {
    let ts = new Date().getTime();

    if (ts - lastFetch > rateLimit) {
        fetchPending = true;
        lastFetch = ts;
    }

    let parameters = nconf.get();
    parameters.timestamp = lastFetch;
    parameters.fetch_possible = rateLimit - (ts - lastFetch);
    parameters.hits = ++hits;

    yield this.render('index', parameters);

    try {
        fs.writeFileSync(hitsFile, hits);
    } catch(e) {}
});

let port = nconf.get('node_http_port');
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(port);

console.log(`Listening at http://localhost:${port}`);
