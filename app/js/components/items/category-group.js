import React from 'react';
import ItemDetails from './details';

export default function CategoryGroup ({ group: {category, items}, actions }) {
    const
        href = category ? category.replace(' ', '-').toLowerCase() : 'uncategorized',
        list = items.map((item, key) => {
            const props = { item, actions, key };
            return (<ItemDetails {...props} ></ItemDetails>)
        });

    return (
        <section className='item-group'>
            <h1 className='item-group__category' id={href}>{category}</h1>
            {list}
        </section>
    )

}
