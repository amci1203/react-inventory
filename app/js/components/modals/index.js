import React from 'react';
import { connectToStore } from '../../helpers';
import * as actions from '../../actions/items';

// import Log           from './log'
import NewItem       from './new';
import EditItem      from './edit';
import DeleteItem    from './delete';
import ConfirmDelete from './confirm-delete';
// import ConfirmDelete from './confirm-delete';

function Modals (props) {
    const
        { items: { all, active, categories } } = props,

        itemList = all ? all.map(i => i.name.toLowerCase()) : null,

        itemDataList = all ?
            all.map(({name}, i) => (<option key={i}>{name}</option>)) : null,

        categoriesDataList = categories ?
            categories.map((cat, i) => (<option key={i}>{cat}</option>)) : null;

    return (
        <div>
            <NewItem
                items={all}
                names={itemList}
                save={props.addItem}
            />
            <DeleteItem
                items={all}
                names={itemList}
                del={props.removeItem}
            />
            <EditItem
                items={all}
                names={itemList}
                active={active}
            />
            <ConfirmDelete
                items={all}
                item={active}
                del={props.removeItem}
            />

            <datalist id='items-list'>{itemDataList}</datalist>
            <datalist id='categories-list'>{categoriesDataList}</datalist>
        </div>
    )
}

const state = items => Object.assign({}, items);
export default connectToStore(state, actions, Modals)
