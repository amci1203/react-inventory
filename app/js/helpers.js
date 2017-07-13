import React from 'react';
import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

export function connectToStore(mapStateToProps, actions, component) {
    const mapDispatchToProps = dispatch => {
        return bindActionCreators(actions, dispatch);
    };
    return connect(mapStateToProps, mapDispatchToProps)(component)
}

export function makeErrorDiv (error) {
    return error ? <p className='errors'>{error}</p> : null;
}

export function makeSubmitButton (btnText, error, action) {
    return error ? null : (
        <button
            className="submit"
            onClick={() => action()}
        >SAVE</button>
    );
}
