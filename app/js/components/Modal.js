import React, { Component } from 'react';
import { connectToStore } from '../helpers'
import { closeModal } from '../actions/modals';


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


const state = ({ activeModal }) => Object.assign({}, { activeModal });
export default connectToStore(state, { closeModal }, Modal);
