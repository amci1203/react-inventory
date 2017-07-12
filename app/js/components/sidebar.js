import React, { Component } from 'react';

import SearchBar from './sidebar/search-bar';
import SidebarButtons from './sidebar/buttons';

export default function Sidebar (props) {

    return (
        <aside className='sidebar'>
            <h1 className="sidebar__title">HOUSEKEEPING</h1>
            <SearchBar />
            <SidebarButtons />
        </aside>
    )

}
