function SidebarButtons (props) {

    const
        fBtn = (f => {
            const props = switch (f) {
                case 'IN_STOCK':
                    return {
                        text: 'LOW',
                        icon: '!'
                    }
                case 'LOW':
                    return {
                        text: 'DEPLETED',
                        icon: '&#10060'
                    }
                case 'DEPLETED':
                    return {
                        text: 'ALL',
                        icon: 'O'
                    }
                default:
                    return {
                        text: 'IN_STOCK',
                        icon: '&#10003'
                    }
            },
            displayText = `SHOW ${props.text.replace('_', ' ')}`;

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
                    onClick={e => openModal('log')}
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
