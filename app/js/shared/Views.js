import React, { Component, Children, cloneElement } from 'react';

export default class Views extends Component {

    constructor (props) {
        super(props);

        this.select = this.select.bind(this);
        this.returnToDefaultView = this.returnToDefaultView.bind(this);

        this.state = {
            active: props.default,
        }
    }

    select (id) {
        this.setState({ active: id === '__default' ? this.props.default : id });
    }

    returnToDefaultView () {
        this.select('__default');
    }

    render () {
        const
            { children, className } = this.props,
            { active } = this.state;

        let activeView = null;

        Children.forEach(children, child => {
            if (!activeView) {
                activeView = child.props.id === active ? child : null;
            }
        })

        const
            { returnToDefaultView } = this,
            view = cloneElement(activeView, [returnToDefaultView]);

        return (
            <div className={className}>{view}</div>
        )
    }

}
