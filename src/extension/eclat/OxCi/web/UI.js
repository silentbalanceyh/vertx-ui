import React from 'react';
import {Icon} from "antd";
import Ux from 'ux';
import Event from '../event';

class Component extends React.PureComponent {
    render() {
        const {data = {}, onClick} = this.props;
        return (
            <span>
                {/* eslint-disable-next-line */}
                <a href={"#"} onClick={onClick}>
                    {data.code}&nbsp;&nbsp;<Icon type={"search"}/>
                </a>
            </span>
        );
    }
}

export default (reference) => (props) => {
    props.onClick = (event) => {
        Ux.prevent(event);
        Event.onProbe(reference, props.data);
    };
    return (<Component {...props}/>);
};