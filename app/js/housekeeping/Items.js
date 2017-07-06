import React, { Component } from 'react';

export default function Items (props) {

    const
        { items, filterMsg, onEditClick, onDeleteClick } = props,
        all = items.map((props, key) => {
            Object.assign(props, { key, onEditClick, onDeleteClick });
            return <CategoryGroup {...props} ></CategoryGroup>
        });

    return (
        <section className='items'>
            {filterMsg}
            {all}
        </section>
    )
}

function CategoryGroup (props) {
    const
        { category, items, onEditClick, onDeleteClick } = props,
        href   = category ? category.replace(' ', '-').toLowerCase() : 'uncategorized',
        _items = items.map((item, key) => {
            const props = { item, key, onEditClick, onDeleteClick };
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
                <span
                    className='btn btn--primary btn--small'
                    onClick={() => props.onEditClick(props.item)}
                >EDIT</span>
                <span
                    className='btn btn--danger btn--small'
                    onClick={() => props.onDeleteClick(props.item)}
                >DELETE</span>
            </div>
        </article>
    )
}
