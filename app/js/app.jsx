import React, { createElement } from 'react';
import ReactDOM, { render } from 'react-dom';

import Housekeeping from './housekeeping/main.jsx';

const
    current = 'Housekeeping',
    departments = { Housekeeping };




showActiveDepartment(current);




function showActiveDepartment (dept) {
    render(createElement(departments[dept]), document.getElementById('app'));
}
