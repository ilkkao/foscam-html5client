# foscam-html5client

Node.js app that can act as a proxy in front of [Foscam](http://foscam.us/) IP cameras.

![Screenshot](http://i.imgur.com/fHnpddq.jpg)

![Screenshot](http://i.imgur.com/FIaHSHy.png)

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
node index.js
```

### Contributing

PRs very welcome!

## Compability

Tested with Foscam FI9828W V1.
