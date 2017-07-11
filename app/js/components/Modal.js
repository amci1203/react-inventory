import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { closeModal } from '../actions/modals';

const
    mapState = ({ activeModal }) => {
        return { activeModal }
    },
    mapDispatch = dispatch => {
        return bindActionCreators({ closeModal }, dispatch)
    }

class Modal extends Component {

    constructor (props) {
        super(props);
        this.initListener.call(this);
    }

    initListener () {
        this.close = e => e.keyCode == 27 && this.props.closeModal();
        window.addEventListener('keydown', this.close)
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.close);
    }

    makeErrorDiv (error) {
        return error ? <p className='errors'>{error}</p> : null;
    }

    makeSubmitButton (btnText, error, action) {
        return error ? null : (
            <button
                className="submit"
                onClick={() => action()}
            >SAVE</button>
        );
    }

    render () {
        const
            { id, activeModal, children, closeModal } = this.props,
            modalClass = id === activeModal ? 'modal modal--open' : 'modal';

        return (
            <div className={modalClass}>
                <span className="modal__close" onClick={closeModal}></span>
                <div className='modal__body' >{children}</div>
            </div>
        )
    }
}


export default connect(mapState, mapDispatch)(Modal)
