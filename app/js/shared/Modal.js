import React, { Component } from 'react';

export default class Modal extends Component {

    constructor (props) {
        super(props);
        this.initListener.call(this);
    }

    initListener () {
        this.close = e => e.keyCode == 27 && this.props.onClose();
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
        const { onClose, children } = this.props;
        return (
            <div className='modal modal--open'>
                <span className="modal__close" onClick={onClose}></span>
                <div className='modal__body' >{children}</div>
            </div>
        )
    }
}
