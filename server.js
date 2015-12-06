'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const nconf = require('nconf');
const socketIo = require('socket.io');
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
    hits = JSON.parse(fs.readFileSync(hitsFile)).hits || 0;
} catch(e) {}

app.use(function *(next){
    let start = new Date;
    yield next;
    let ms = new Date - start;
    console.log(`${this.method} ${this.url} - ${ms}`);
    console.log(`  [RESP] (${this.status})`);
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
        fs.writeFileSync(hitsFile, JSON.stringify({ hits: ++hits }));
    } catch(e) {}
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer('dist'));

let server = require('http').Server(app.callback());
let io = socketIo(server);

io.on('connection', socket => {
    let authenticated = false;

    let emit = (type, data) => {
        data.type = type;
        socket.emit('event', data);
    };

    socket.on('START_LOGIN', data => {
        if (data.secret === clientPasswordMD5 || data.password === clientPassword) {
            emit('COMPLETE_LOGIN_SUCCESS', { secret: clientPasswordMD5 });
            emit('UPDATE_HITS', { hits: hits });
            authenticated = true;
        } else if (data.secret !== clientPasswordMD5 && !data.password) {
            emit('COMPLETE_LOGIN_FAILURE', { reason: 'Session expired' });
        } else {
            emit('COMPLETE_LOGIN_FAILURE', { reason: nconf.get('incorrect_password_label')} );
        }
    });

    socket.on('LOGOUT', data => {
        authenticated = false;
    });
});

let port = nconf.get('node_http_port');

server.listen(port);

console.log(`Listening at http://localhost:${port}`);
