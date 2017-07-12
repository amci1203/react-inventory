import React, { Component } from 'react'
import Modal from '../Modal';

export default function ConfirmDelete ({ item, onConfirm, onClose }) {

    return (
        <Modal onClose={onClose}>
            <p className='text-center'>{'Are you sure you want to delete ' + item.name + '?'}</p>
            <button className='btn btn--wide btn--danger' onClick={onConfirm}>CONFIRM</button>
        </Modal>
    )

}
