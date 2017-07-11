import React, { Component, Children, cloneElement } from 'react';

import NewItem       from './modals/new';
import EditItem      from './modals/edit';
import DeleteItem    from './modals/delete';
import ConfirmDelete from './modals/confirm-delete';
import Log           from './modals/log';


export default function ModalList (props) {
    return (
        <div>
            <NewItem />
            <EditItem />
            <DeleteItem />
            <ConfirmDelete />
            <Log />
        </div>
    )
}
