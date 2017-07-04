import React, { Component } from 'react';

export default class Sidebar extends Component {

    constructor (props) {
        super(props);
        this.state = {}
    }

    render () {
        const
            { handleSearch, categories, newItem, editItem, deleteItem } = this.props,
            _categories = categories.map((cat, key) => {
                const href = `#${cat.replace(' ', '-').toLowerCase()}`;
                return <li key={key}><a href={href}>{cat}</a></li>;
            });

        return (
            <section>
                <aside className='sidebar'>
                    <h1 className="sidebar__title">HOUSEKEEPING</h1>
                    <input placeholder='Search...' onChange={e => handleSearch(e.target.value)}/>
                    <ul className='categories-list'>{_categories}</ul>
                </aside>
                <aside className='sidebar__aside-buttons'>
                    <div className='sidebar__aside-buttons__top'>
                        <span
                            className='icon icon--text'
                            onClick={newItem}
                        >+</span>
                        <img
                            className='icon'
                            src='icons/edit.png'
                            onClick={editItem}
                        />
                        <img
                            className='icon'
                            src='icons/delete.png'
                            onClick={deleteItem}
                        />
                    </div>
                    <div className='sidebar__aside-buttons__bottom'>
                        <span className='icon icon--text'>?</span>
                    </div>
                </aside>
            </section>
        )
    }

}
