import React from 'react';
import { connectToStore } from '../../helpers';
import * as actions from '../../actions/items';

import Log           from './log'
import NewItem       from './new';
import EditItem      from './edit';
import DeleteItem    from './delete';
import ConfirmDelete from './confirm-delete';

function Modals ({ items: { all, active, categories }, actions }) {
    const
        categoriesList = categories ?
            categories.map((item, i) => (<option key={i}>{category}</option>)) : null,
        itemList = all ?
            all.map((item, i) => (<option key={i}>{item.name}</option>)) : null;
    return (
        <div>
            <NewItem items={all} />
            <DeleteItem items={all} />
            <datalist id='items-list'>{itemList}</datalist>
            <datalist id='categories-list'>{categoriesList}</datalist>
        </div>
    )
}

const state = ({ items }) => Object.assign({}, { items });
export default connectToStore(state, actions, Modals)
