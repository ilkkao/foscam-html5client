import React from 'react';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import App from './containers/App';
import { completeLoginSuccess, completeLoginFailure } from './actions/session';
import reducer from './reducers';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './styles/style.css';

// Needed for onTouchTap. Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const location = window.location;
const socket = io(`${location.protocol}//${location.hostname}:${settings.socketIoPort}`);

socket.on('connect', () => {
    let secret = Cookies.get('secret');

    if (secret) {
        socket.emit('START_LOGIN', { secret: secret });
    }
});

socket.on('event', data => store.dispatch(data));
socket.on('disconnect', function() {});

const socketIo = store => next => action => {
    if (action.meta && action.meta.remote) {
        let { type, meta, ...remoteAction } = action;
        socket.emit(type, remoteAction);

        console.log(`Emitted '${type}'`, remoteAction);
    }

    return next(action);
}

const createStoreWithMiddleware = applyMiddleware(
    socketIo
)(createStore);

const store = createStoreWithMiddleware(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  window.document.getElementById('root')
);
