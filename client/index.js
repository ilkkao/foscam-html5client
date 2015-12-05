import React from 'react';
import Cookies from 'js-cookie';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from './containers/App';
import { verifySession } from './actions/session';
import reducer from './reducers';
import injectTapEventPlugin from 'react-tap-event-plugin';

import './styles/style.css';

// Needed for onTouchTap. Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducer, {
    session: {
        loggedIn: false,
        loginFailureReason: '',
        secret: ''
    }
});

let secret = Cookies.get('secret');

if (secret) {
    store.dispatch(verifySession(secret));
}

render(
  <Provider store={store}>
    <App />
  </Provider>,
  window.document.getElementById('root')
);
