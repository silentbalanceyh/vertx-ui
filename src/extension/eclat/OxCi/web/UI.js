import React from 'react';
import {Icon, Modal} from "antd";
import Ux from 'ux';
import Event from '../event';

class Component extends React.PureComponent {
    render() {
        const {data = {}, onClick} = this.props;
        return (
            <span>
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
        const existing = Event.ciExisting(reference, props.data);
        if (existing) {
            const modal = Ux.fromHoc(reference, "modal");
            modal.content = Ux.formatExpr(modal.content, props.data, true);
            Modal.confirm({
                ...modal,
                onOk: () => {
                    const state = Event.ciMoveData(reference, props.data);
                    reference.setState(state);
                }
            })
        } else {
            const state = Event.ciOpen(reference, props.data);
            reference.setState(state);
        }
    };
    return (<Component {...props}/>);
};