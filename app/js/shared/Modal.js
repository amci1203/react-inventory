import React, { Component, Children, cloneElement } from 'react';

/*
    ModalBody is used to nest modal content
    Modals holds various bodies and handles opening and closing
*/

export function ModalBody ({ open, children }) {

    return (
        <div className={'modal__body' + open ? ' active' : ''}>{children}</div>
    )

}

export default class Modals extends Component {

    constructor (props) {
        super(props);

        this.close = this.close.bind(this);

        this.state = {
            open: false, // string value indicating the modal id || false if closed
        }

        this.listen();
    }

    listen() {
        click(window, e => e.keyCode == 27 && this.state.open && this.close())
    }

    open (name) {
        if (!this.state.open) {
            this.setState({open: name});
        }
    }

    close () {
        if (this.state.open) {
            this.setState({ open: false })
        }
    }

    render () {

        const
            { close, children } = this.props,
            { open } = this.state,
            isOpen = open ? 'modal--open' : '';

            _children = Children(children, child => cloneElement(child, [...child.props, open]));


        return (
            <div className={'modal ' + isOpen}>
                <span
                    className='modal__close'
                    onClick={this.props.close}
                >X</span>
            {_children}
            </div>
        )

    }

}
