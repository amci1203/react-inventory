import React from 'react';

export default function List ({ type, list, active, openItemDetails, next, prev }) {

    const listItems = type == 'all' ? (
        list.map((l, i) => {
            const href = '#' + l.toLowerCase().replace(' ', '-');
            return (
                <li key={i}>
                    <a href={href} >{l}</a>
                </li>
            )
        })
    ) : (
        list.map((l, i) => {
            const href = '#';
            return (
                <li key={i}>
                    <a
                        className={active === l.name ? 'active' : ''}
                        href={href}
                        onClick={() => openItemDetails(l)}
                    >{l.name}</a>
                </li>
            )
        })
    )

    return (
        <ul className='sidebar__list'>{ listItems }</ul>
    )

}
