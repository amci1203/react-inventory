import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

// MIDDLEWARES
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import createDebounce from 'redux-debounced';

import App from './components';
import reducers from './reducers';

const
    logger = createLogger(),
    thunk = thunkMiddleware,
    debounce = createDebounce(),
    middlewares = [ thunk, logger, debounce ],
    store = applyMiddleware(...middlewares)(createStore)(reducers);

render((

    <Provider store={store}>
        <App />
    </Provider>

), document.getElementById('app'))
