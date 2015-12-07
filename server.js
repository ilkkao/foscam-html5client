'use strict';

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const http = require('http');
const nconf = require('nconf');
const socketIo = require('socket.io');
const koa = require('koa');
const staticServer = require('koa-static');
const request = require('superagent-bluebird-promise');

nconf.argv().env().file({ file: 'config.json' });

const rateLimit = nconf.get('rate_limit') * 1000 || 60000;
const baseUrl = nconf.get('base_url');
const username = nconf.get('user_name');
const password = nconf.get('password');

const clientPassword = nconf.get('web_password');
const clientPasswordMD5 = crypto.createHash('md5').update(password).digest('hex');

let fetchPromise = false;

let img;
let imgTs = 0;

const hitsFile = path.join(__dirname, '.hits_counter');
let hits = readHitsFromFile();

let app = configureKoa();
let server = http.Server(app.callback());
let io = socketIo(server);

io.on('connection', socket => {
    let authenticated = false;

    let emit = (type, data) => {
        data.type = type;
        socket.emit('event', data);
    };

    let sendImage = () => {
        getImage()
           .then(image => emit('SHOW_IMAGE', { image: image, ts: imgTs }))
           .catch(err => emit('SHOW_IMAGE', { image: false, ts: Date.now() }));
    }

    socket.on('START_LOGIN', data => {
        if (data.secret === clientPasswordMD5 || data.password === clientPassword) {
            emit('COMPLETE_LOGIN_SUCCESS', { secret: clientPasswordMD5 });
            emit('UPDATE_HITS', { hits: hits });
            sendImage();
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

    socket.on('GET_IMAGE', data => sendImage());
});

startServer(server);

function configureKoa() {
    let app = koa();

    app.use(function *(next){
        let start = new Date;
        yield next;
        let ms = new Date - start;
        console.log(`${this.method} ${this.url} - ${ms}`);
        console.log(`  [RESP] (${this.status})`);
    });

    app.use(staticServer('dist'));

    return app;
}

function startServer(server) {
    let port = nconf.get('node_http_port');

    server.listen(port);

    console.log(`Listening at http://localhost:${port}`);
}

function readHitsFromFile() {
    let hits = 0;

    try {
        hits = JSON.parse(fs.readFileSync(hitsFile)).hits || 0;
    } catch(e) {}

    return hits;
}

function addHit() {
    try {
        fs.writeFileSync(hitsFile, JSON.stringify({ hits: ++hits }));
    } catch(e) {}
}

function getImage() {
    if (imgTs + rateLimit > Date.now()) {
        console.log('Returned cached image');
        return Promise.resolve(img);
    }

    if (!fetchPromise) {
        let url = `${baseUrl}/CGIProxy.fcgi?cmd=snapPicture2&usr=${username}&pwd=${password}`;
        fetchPromise = request.get(url);
    }

    return fetchPromise.then(resp => {
        fetchPromise = false;
        img = resp.body
        imgTs = Date.now();

        return img;
    });
}
