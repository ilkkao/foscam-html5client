'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const nconf = require('nconf');
const koa = require('koa');
const router = require('koa-router')();
const staticServer = require('koa-static');
const request = require('superagent-bluebird-promise');
const app = koa();

nconf.argv().env().file({ file: 'config.json' });

let rateLimit = nconf.get('rate_limit') * 1000 || 60000;
let baseUrl = nconf.get('base_url');
let username = nconf.get('user_name');
let password = nconf.get('password');

let clientPassword = nconf.get('web_password');
let clientPasswordMD5 = crypto.createHash('md5').update(password).digest('hex');

let fetchInProgress = false;
let img;

let hitsFile = path.join(__dirname, '.hits_counter');
let hits = 0;

try {
    hits = fs.readFileSync(hitsFile);
} catch(e) {}

app.use(function *(next){
    let start = new Date;
    yield next;
    let ms = new Date - start;
    console.log(`${this.method} ${this.url} - ${ms}`);
    console.log(`  [RESP] (${this.status})`);
});

router.get('/api/login', function *() {
    let resp = { status: 'error' };

    if (this.query.password === clientPassword) {
        resp.status = 'ok';
        resp.secret = clientPasswordMD5;
    } else {
        resp.reason = nconf.get('incorrect_password_label');
    }

    this.body = resp;
});

router.get('/api/logout', function *() {
    this.session.password = '';
    this.status = 200;
});

router.get('/api/session', function *() {
    let resp = { status: 'error' };

    if (this.query.secret === clientPasswordMD5) {
        resp.status = 'ok';
    } else {
        resp.reason = nconf.get('expired_session_label');
    }

    this.body = resp;
});

router.get('/api/snapshot.png', function *() {
    if (this.query.secret !== clientPasswordMD5) {
        this.status = 401;
        return;
    }

    if (!fetchInProgress) {
        fetchInProgress = true;
        let url = `${baseUrl}/CGIProxy.fcgi?cmd=snapPicture2&usr=${username}&pwd=${password}`;
        img = yield request.get(url);
        fetchInProgress = false;
    }

    this.body = img.body;
    this.type = 'png';

    try {
        fs.writeFileSync(hitsFile, ++hits);
    } catch(e) {}
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(staticServer('dist'));

let port = nconf.get('node_http_port');
app.listen(port);

console.log(`Listening at http://localhost:${port}`);
