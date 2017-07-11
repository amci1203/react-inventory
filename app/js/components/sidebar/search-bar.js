import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { search } from '../../actions/filters';

function SearchBar ({ search }) {

    const change = ({ target }) => debounce(() => search(target.value), 300);

    return (
        <input
            ref={i => input = i}
            onChange={change}
        />
    )

}
