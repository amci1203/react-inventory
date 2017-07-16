import React from 'react';
import Log from './log';

export default function ItemDetails ({
    item, logOpen, next, prev,
    actions: { openModal, openItemDetails, closeItemDetails }
}) {
    const
        { name, inStock, lowAt, lastModified, index } = item,
        isLow = lowAt > inStock,
        _lastModified = lastModified ? `Last Updated: ${lastModified.substring(0, 10)}` : '',

        log = logOpen ? (<Log log={item.log} />) : null,

        open = logOpen ? null : (
            <span
                className='option clickable'
                onClick={() => openItemDetails(item)}
            >OPEN</span>
        ),

        prevBtn = prev ? (
            <span
                className='prev tooltip'
                onClick={() => openItemDetails(prev)}
            >
                <span className='tooltip-text show-bottom'>{prev.name}</span>
                <span className='caret caret--left'></span>
            </span>
        ) : null,
        nextBtn = next ? (
            <span
                className='next tooltip'
                onClick={() => openItemDetails(next)}
            >
                <span className='tooltip-text show-bottom'>{next.name}</span>
                <span className='caret caret--right'></span>
            </span>
        ) : null,

        nav = logOpen ? (
            <nav className='item-card__top-nav'>
                { prevBtn }
                <span
                    className='home tooltip'
                    onClick={() => closeItemDetails()}
                >
                    <span className='tooltip-text show-bottom'>HOME</span>
                    <span className='caret caret--up'></span>
                </span>
                { nextBtn }
            </nav>
        ) : null;

    return (
        <article
            className={ `item-card ${isLow ? 'low' : ''} ${logOpen ? 'single' : ''}` }
        >
            { nav }
            <h1
                className='item-card__item-name clickable'
                onClick={() => !logOpen && openItemDetails(item)}
            >{name}</h1>
            <span className='item-card__item-stock'>{inStock}</span>
            <span className='item-card__item-last-modified'>{_lastModified}</span>
            <div className='item-card__options'>
                {open}
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
