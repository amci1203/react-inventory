import React, { Component, Children, cloneElement } from 'react';

/*
    This Modal Component is a base component for the various forms
    that the app will employ.

    PROPS:
        action (Function): the function to invoke when the submit button is pressed
        opaque (Boolean): self explanatory

    STATE:
        open (Boolean): self explanatory
        // id: the id of the item that opened it (will remain null for new entries)
*/

export default class Modal extends Component {

    constructor (props) {
        super(props);

        this.listenForEscape();
    }

    close (caller) {
        caller.setState({
            open: false
        })
    }

    listenForEscape () {
        window.addEventListener('keydown', e => e.keyCode == 27 && this.state.open && this.close());
    }

    render () {
        const
            { open, opaque, children, title } = this.props,
            modalCls = `modal ${open ? 'modal--open' : ''}`,
            bodyCls  = `modal__body ${opaque ? 'modal__body--opaque' : ''}`;
            // MAY HAVE TO PASS SOME THINGS LATER
            // props    = {  }
            // children = Children.map(this.props.children, child => cloneElement(child, props));

        return (
            <div className={modalCls}>
                <span className='modal__close' onClick={this.close}>X</span>
                { title ? <h1 className="modal__header">{title}</h1> : '' }
                <div className={bodyCls}>{children}</div>
            </div>
        )
    }

}
