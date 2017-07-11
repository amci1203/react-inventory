import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';

export function connectToStore(mapStateToProps, actions, component) {
    const mapDispatchToProps = dispatch => {
        return bindActionCreators(actions, dispatch);
    };
    return connect(mapStateToProps, mapDispatchToProps)(component)
}
