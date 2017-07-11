import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux'

import App from './components';
import reducers from './reducers';

const store = applyMiddleware()(createStore)(reducers);

render((

    <Provider store={store}>
        <App />
    </Provider>

), document.getElementById('app'))
