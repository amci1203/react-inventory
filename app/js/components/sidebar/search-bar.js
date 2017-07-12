import React from 'react';
import { connectToStore } from '../../helpers';

import { setSearch } from '../../actions/filters';

function SearchBar ({ setSearch }) {

    return (
        <input
            onChange={ ({ target }) => setSearch(target.value) }
            placeholder='Search...'
        />
    )

}
export default connectToStore(null, { setSearch }, SearchBar);
