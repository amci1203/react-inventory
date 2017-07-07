import React, { Component } from 'react';

export default function Items (passed) {

    const
        { items, filterMsg } = passed,
        all = items.map((_props, key) => {
            const props = Object.assign({}, passed, _props, { key });
            return <CategoryGroup {...props} ></CategoryGroup>
        });

    return (
        <section className='items'>
            {filterMsg}
            {all}
        </section>
    )
}

function CategoryGroup (parent) {
    const
        { category } = parent,
        href = category ? category.replace(' ', '-').toLowerCase() : 'uncategorized',
        items = parent.items.map((item, key) => {
            const props = Object.assign({}, parent, { item } , { key });
            return <Item {...props} ></Item>
        });

    return (
        <section className='item-group'>
            <h1 className='item-group__category' id={href}>{category}</h1>
            { items }
        </section>
    )

}

function Item (props) {
    const
        { Edit, Log, Delete, Details, item } = props,
        { name, inStock, lowAt, lastModified } = item,
        isLow = lowAt > inStock,
        _lastModified = lastModified ? `Last Updated: ${lastModified.substring(0, 10)}` : '';

    return (
        <article className={`item-card ${isLow ? 'low' : ''}`}>
            <h1
                className='item-card__item-name'
                onClick={() => Details(item)}
            >{name}</h1>
            <span className='item-card__item-stock'>{inStock}</span>
            <span className='item-card__item-last-modified'>{_lastModified}</span>
            <div className='item-card__options'>
                <span
                    className='option clickable'
                    onClick={() => Edit(item)}
                >EDIT</span>
                <span
                    className='option clickable'
                    onClick={() => Log(item)}
                >LOG</span>
                <span
                    className='option option--danger clickable text-danger'
                    onClick={() => Delete(item)}
                >DELETE</span>
            </div>
        </article>
    )
}
