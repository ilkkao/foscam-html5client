# foscam-html5client

Node.js app that can act as a proxy in front of [Foscam](http://foscam.us/) IP cameras.

![Screenshot](http://i.imgur.com/lPUxHk1.png)

## Features

- Hides the IP address, user name, and password of the camera.
- Rate limits the requests to the camera. By default, a snapshot is fetched at maximum once in a minute. Refresh button is enabled only when a new photo is available.
- Optional password protection
- i18n support
- Mobile friendly
- Hits counter

## Installation

```bash
git clone https://github.com/ilkkao/foscam-html5client.git
cd foscam-html5client
npm install
cp config.json.example config.json
[edit config.json]
npm run build
node server.js
```

### Contributing

PRs very welcome!

App is build on React.js, Redux, Material UI, Immutable.js, Koa, and Socket.io.

## Compability

Tested with Foscam FI9828W V1.
