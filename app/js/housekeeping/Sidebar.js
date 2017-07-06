import React, { Component } from 'react';

export default class Sidebar extends Component {

    constructor (props) {
        super(props);
        this.state = {}
    }

    render () {
        const
            {
                handleSearch,
                handleFilter,
                filter,
                categories,
                newItem,
                editItem,
                deleteItem
            } = this.props,

            _categories = categories.map((cat, key) => {
                const href = `#${cat.replace(' ', '-').toLowerCase()}`;
                return <li key={key}><a href={href}>{cat}</a></li>;
            }),

            fBtnProps = (f => {
                switch (f) {
                    case 'in-stock':
                        return {
                            text: 'LOW',
                            icon: '!'
                        }
                    case 'low':
                        return {
                            text: 'DEPLETED',
                            icon: '&#10060'
                        }
                    case 'depleted':
                        return {
                            text: 'ALL',
                            icon: 'O'
                        }
                    default:
                        return {
                            text: 'IN STOCK',
                            icon: '&#10003'
                        }
                }
            })(filter),

            filterButton = (
                <span
                    className='icon icon--text tooltip'
                    onClick={() => handleFilter(filter)}
                >
                    <span className='tooltip-text'>SHOW {fBtnProps.text}</span>
                    <span dangerouslySetInnerHTML={{__html: fBtnProps.icon}}></span>
                </span>
            );

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
                        <span
                            className='icon'
                            onClick={editItem}
                        ><img src='icons/log.png' />
                        </span>
                        <span
                            className='icon'
                            onClick={deleteItem}
                        ><img src='icons/delete.png' />
                        </span>
                    </div>
                    <div className='sidebar__aside-buttons__bottom'>
                        {filterButton}
                        <span className='icon icon--text'>?</span>
                    </div>
                </aside>
            </section>
        )
    }

}
