import React from 'react';
import Log from './log';

export default function ItemDetails ({
    item,
    logOpen,
    actions: { openModal, openItemDetails }
}) {
    const
        { name, inStock, lowAt, lastModified } = item,
        isLow = lowAt > inStock,
        _lastModified = lastModified ? `Last Updated: ${lastModified.substring(0, 10)}` : '',
        log = logOpen ? (<Log log={item.log} />) : null;

    return (
        <article className={`item-card ${isLow ? 'low' : ''}`}>
            <h1
                className='item-card__item-name clickable'
                onClick={() => openItemDetails(item)}
            >{name}</h1>
            <span className='item-card__item-stock'>{inStock}</span>
            <span className='item-card__item-last-modified'>{_lastModified}</span>
            <div className='item-card__options'>
                <span
                    className='option clickable'
                    onClick={() => openItemDetails(item)}
                >OPEN</span>
                <span
                    className='option clickable'
                    onClick={() => openModal('edit', item)}
                >EDIT</span>
                <span
                    className='option clickable'
                    onClick={() => openModal('log', item)}
                >ADD LOG</span>
                <span
                    className='option option--danger clickable text-danger'
                    onClick={() => openModal('confirm-delete', item)}
                >DELETE</span>
            </div>
            { log }
        </article>
    )
}
