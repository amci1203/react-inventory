import React from 'react';
import { connectToStore } from '../../helpers';

import { setFilter } from '../../actions/filters';
import { openModal } from '../../actions/modals';

function SidebarButtons ({ filter, openModal, setFilter }) {

    const filterButton = (f => {
        let props;
        switch (f) {
            case 'IN_STOCK':
                props = {
                    text: 'LOW',
                    icon: '!',
                }
                break;
            case 'LOW':
                props = {
                    text: 'DEPLETED',
                    icon: '&#10060'
                }
                break;
            case 'DEPLETED':
                props = {
                    text: 'ALL',
                    icon: 'O'
                }
                break;
            default:
                props = {
                    text: 'IN_STOCK',
                    icon: '&#10003'
                }
        }
        const displayText = `SHOW ${props.text.replace('_', ' ')}`;

        return (
            <span
                className='icon icon--text tooltip'
                onClick={() => setFilter(props.text)}
            >
                <span className='tooltip-text'>{displayText}</span>
                <span dangerouslySetInnerHTML={{__html: props.icon}}></span>
            </span>
        )
    })(filter.stock);

    return (
        <aside className='sidebar__aside-buttons'>
            <div className='sidebar__aside-buttons__top'>
                <span
                    className='icon icon--text tooltip'
                    onClick={e => openModal('new')}
                >
                    <span className='tooltip-text'>New item</span>
                    +
                </span>
                <span
                    className='icon tooltip'
                    onClick={e => openModal('log-multi')}
                >
                    <span className='tooltip-text'>Submit Logs</span>
                    <img src='icons/log.png' />
                </span>
                <span
                    className='icon tooltip'
                    onClick={e => openModal('delete')}
                >
                    <span className='tooltip-text'>Delete Item</span>
                    <img src='icons/delete.png' />
                </span>
            </div>
            <div className='sidebar__aside-buttons__bottom'>
                <span
                    className='icon tooltip'
                    onClick={() => {}}
                >
                    <span className='tooltip-text'>Print Day Report</span>
                    <img src='icons/print.png' />
                </span>
                {filterButton}
                <span className='icon icon--text'>?</span>
            </div>
        </aside>
    )
}

const state = filter => Object.assign({}, filter);
export default connectToStore(state, { openModal, setFilter }, SidebarButtons);
