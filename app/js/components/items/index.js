import React, { Component } from 'react';
import { connectToStore } from '../../helpers';
import { openModal } from '../../actions/modals';
import { fetchItems, setCategories, openItemDetails, closeItemDetails } from '../../actions/items';

import CategoryGroup from './category-group';
import ItemDetails from './details';

class Items extends Component {

    constructor (props) {
        super(props)
        this.addListener()
    }

    addListener () {
        const { closeItemDetails } = this.props;
        this.closeLog = e => !this.props.activeModal && this.props.items.logOpen && e.keyCode == 27 && closeItemDetails();
        window.addEventListener('keydown', this.closeLog);
    }

    componentWillUnmount () {
        window.removeEventListener('keydown', this.closeLog)
    }

    render () {
        const {
            items: { all, active, logOpen },
            filter,
            openModal,
            openItemDetails,
            closeItemDetails,
            fetchItems
        } = this.props;

        if (!all) {
            fetchItems();
            return (
                <section className='items loading'>
                    <img src='icons/loading.svg' />
                </section>
            )
        }

        /*
            !!!!!!!!!!!!!!!!!
            ADD ACTIONS BELOW
        */

        const actions = { openModal, openItemDetails, closeItemDetails };

        if (logOpen) {
            const
                item = active,
                prev = active.index === 0 ? null : all[active.index - 1],
                next = active.index === all.length - 1 ? null : all[active.index + 1],
                props = { item, prev, next, actions, logOpen };

            return (<div className='single'><ItemDetails {...props} /></div>);
        }

        const groupedItems = ((_items, filter, search) => {
            const
                _search = search ? new RegExp(`^(${search.replace(/\s/g, '')})`, 'i') : null,
                grouped = [],
                items   = _items
                    .filter(i => matchFilter(i, filter))
                    .filter(i => matchSearch(i, _search))
                ;

            let tmp = {};
            items.forEach((item, i) => {
                if (i === 0) {
                    Object.assign(tmp, {
                        category: item.category,
                        items: [item]
                    })
                }
                else {
                     if (item.category === items[i - 1].category) {
                         tmp.items.push(item)
                     } else {
                         grouped.push(tmp);
                         tmp = {category: item.category, items: [item]};
                     }
                     if (i === items.length - 1) grouped.push(tmp);
                }

            })

            return grouped;
        })(all, filter.stock, filter.nominal);

        const

            filterNotification = (f => {
                f ? (<h3>Showing: {f.toUpperCase().replace('_', '\ ')}</h3>) : null;
            })(filter.stock),
            viewableItems = groupedItems.map((group, key) => {
                const props = { group, actions, key };
                return <CategoryGroup {...props} />
            });

        return (
            <section className='items'>
                { filterNotification }
                { viewableItems }
            </section>
        )
    }
}

function matchSearch (item, search) {
    if (!search) return true;

    const
        nameWords = [item.name, ...item.name.split(' ')],
        categoryWords = [item.category, ...item.category.split(' ')],
        len = Math.max(nameWords.length, categoryWords.length);

    for (let i = 0; i < len; i++) {
        let nW = nameWords[i],
            cW = categoryWords[i];

        if (nW && nW.replace(/\s/g, '').match(search)) return true;
        if (cW && cW.replace(/\s/g, '').match(search)) return true;
    }

    return false;
}

function matchFilter (item, filter) {
    const { inStock, lowAt } = item;
    if (filter === 'ALL') return true;
    if (filter === 'LOW' && lowAt > inStock) return true;
    if (filter === 'IN_STOCK' && lowAt < inStock) return true;
    if (filter === 'DEPLETED' && inStock === 0) return true;
    return false;
}



const
    state = ({items, filter, activeModal}) => Object.assign({}, { items, filter, activeModal }),
    actions = { openModal, fetchItems, openItemDetails, closeItemDetails };

export default connectToStore(state, actions, Items);
