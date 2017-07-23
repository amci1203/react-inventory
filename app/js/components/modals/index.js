import React from 'react';
import { connectToStore } from '../../helpers';
import * as actions from '../../actions/items';

// import Log           from './log'
import NewItem       from './new';
import NewMany       from './new-many';
import LogItem       from './log';
import LogMany       from './log-many';
import EditItem      from './edit';
import DeleteItem    from './delete';
import ConfirmDelete from './confirm-delete';

function Modals (props) {
    const
        { items: { all, active, categories }, activeModal } = props,

        itemList = all ? all.map(i => i.name.toLowerCase()) : null,

        itemDataList = all ?
            all.map(({name}, i) => (<option key={i}>{name}</option>)) : null,

        categoriesDataList = categories ?
            categories.map((cat, i) => (<option key={i}>{cat}</option>)) : null,

        modal = (m => {
            switch (m) {
                case 'new':
                    return (
                        <NewItem
                            items={all}
                            names={itemList}
                            save={props.addItem}
                        />
                    )
                case 'new-many':
                    return (
                        <NewMany
                            items={all}
                            names={itemList}
                            saveAll={props.addManyItems}
                        />
                    )
                case 'log':
                    return (
                        <LogItem
                            item={active}
                            log={props.postLog}
                        />
                    )
                case 'log-many':
                    return (
                        <LogMany
                            items={all}
                            names={itemList}
                            logAll={props.postManyLogs}
                        />
                    )
                case 'delete':
                    return (
                        <DeleteItem
                            items={all}
                            names={itemList}
                            del={props.removeItem}
                        />
                    )
                case 'edit':
                    return (
                        <EditItem
                            items={all}
                            names={itemList}
                            active={active}
                            save={props.editItem}
                        />
                    )
                case 'confirm-delete':
                    return (
                        <ConfirmDelete
                            item={active}
                            del={props.removeItem}
                        />
                    )
            }
        })(activeModal)

    return (
        <div>
            {modal}
            <datalist id='items-list'>{itemDataList}</datalist>
            <datalist id='categories-list'>{categoriesDataList}</datalist>
        </div>
    )
}

const state = ({ items, activeModal }) => ({ items, activeModal });
export default connectToStore(state, actions, Modals)
