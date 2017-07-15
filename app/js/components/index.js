import React, { Component } from 'react';

import Sidebar from './sidebar';
import Modals  from './modals';
import Items   from './items';

export default function App (props) {



    return (
        <div className='main-view'>
            <Sidebar />
            <Items />
            <Modals />
        </div>
    )
}
