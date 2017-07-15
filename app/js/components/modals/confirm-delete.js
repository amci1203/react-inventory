import React, { Component } from 'react'
import Modal from '../Modal';

export default function ConfirmDelete ({ item, del }) {

    if (!item) return null;

    return (
        <Modal id='confirm-delete'>
            <p className='text-center'>{'Are you sure you want to delete ' + item.name + '?'}</p>
            <button
                className='btn btn--wide btn--danger'
                onClick={e => del(item)}
            >CONFIRM</button>
        </Modal>
    )

}
