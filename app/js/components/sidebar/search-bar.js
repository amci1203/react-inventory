import React from 'react';


export default function SearchBar ({ setSearch }) {

    return (
        <input
            onChange={ ({ target }) => setSearch(target.value) }
            placeholder='Search...'
        />
    )

}
