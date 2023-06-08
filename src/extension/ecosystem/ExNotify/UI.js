import React from 'react';
import {Tooltip} from "antd";
import Ux from 'ux';

const UCA_NAME = "ExNotify";
const componentInit = (reference) => {
    Ux.sockOn("/job/notify", () => {

    })
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {config = {}} = this.props;
        const {tips = {}, icon = {}} = config;
        return (
            <Tooltip {...tips}>
                {Ux.v4Icon(icon)}
            </Tooltip>
        );
    }
}

export default Component