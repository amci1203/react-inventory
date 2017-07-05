import React, { Component } from 'react'
import Modal from '../../shared/Modal';

export default function ConfirmDelete ({ active, onConfirm }) {

    return (
        <Modal>
            <p className='text-center'>{'Are you sure you want to delete ' + active.name + '?'}</p>
            <button className='btn btn--wide btn--danger' onClick={onConfirm}>CONFIRM</button>
        </Modal>
    )

}
