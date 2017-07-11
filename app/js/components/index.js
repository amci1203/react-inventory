import React, { Component } from 'react';

import Sidebar       from '../Sidebar';
import ModalList     from './modal-list';
import Items         from './items';

export default function App (props) {



    return (
        <div>
            <Sidebar />
            <Items />
        </div>
    )
}
