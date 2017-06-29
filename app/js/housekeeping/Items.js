import React, { Component } from 'react';

export default function Items (props) {

    const
        { items } = props,
        all = items.map((props, key) => {
            props.key = key;
            return <CategoryGroup {...props} ></CategoryGroup>
        });

    return <section className='items'>{all}</section>
}

function CategoryGroup (props) {
    const
        { category, items } = props,
        href   = category ? category.replace(' ', '-').toLowerCase() : 'uncategorized',
        _items = items.map((item, key) => {
            const props = { item, key };
            return <Item {...props} ></Item>
        });

    return (
        <section className='item-group'>
            <h1 className='item-group__category' id={href}>{category}</h1>
            {_items}
        </section>
    )

}

function Item (props) {
    const
        { name, inStock, lowAt, lastModified } = props.item,
        isLow = lowAt > inStock,
        _lastModified = lastModified ? lastModified.substring(0, 10) : '';

    return (
        <article className={`item-card ${isLow ? 'low' : ''}`}>
            <h1 className='item-card__item-name'>{name}</h1>
            <span className='item-card__item-stock'>{inStock}</span>
            <span className='item-card__item-last-modified'>{_lastModified}</span>
            <div className='item-card__options'>
                <span>TEST</span>
                <span>TEST</span>
                <span>TEST</span>
                <span>TEST</span>
            </div>
        </article>
    )
}
