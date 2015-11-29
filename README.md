# foscam-html5client

Node.js app that can act as a proxy in front of Foscam IP cameras.

![Screenshot](http://i.imgur.com/IovgTtu.gif)

- Hides the IP address, user name, and password of the camera.
- Rate limits the requests to the camera. By default, snapshot is fetched at maximum once in a minute.

## Installation

```bash
git clone https://github.com/ilkkao/foscam-html5client.git
cd foscam-html5client
npm install
cp config.json.example config.json
[edit config.json]
node index.js
```

## Compability

Tested with Foscam FI9828W V1.
