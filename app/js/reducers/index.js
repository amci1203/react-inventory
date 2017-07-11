import { combineReducers } from 'redux';

import activeModal from './modals.js';
import filter from './filters.js';
import items from './items.js';

const root = combineReducers({
    items,
    activeModal,
    filter
});

export default root;
