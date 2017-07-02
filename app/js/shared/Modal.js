import React, { Component } from 'react';

export default function Modal (props) {

        return (
            <div className='modal modal--open'>
                <span className="modal__close" onClick={props.onClose}></span>
                <div className='modal__body' >{props.children}</div>
            </div>
        )
}
