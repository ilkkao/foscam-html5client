import React from 'react';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import App from './containers/App'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

import injectTapEventPlugin from 'react-tap-event-plugin';

import './styles/style.css'

// Needed for onTouchTap. Can go away when react 1.0 release
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducer);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
