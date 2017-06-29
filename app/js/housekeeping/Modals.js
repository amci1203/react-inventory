import React, { Component } from 'react';

import Modal from '../shared/Modal';

export class NewModal extends Component {

    constructor (props) {
        super(props);

        this.state = {
            id: null,
            open: false,
        }
    }

    render () {
        return (
            <Modal open={this.state.open} opaque={true}>
                THIS IS A TEST
            </Modal>
        )
    }

}
