import React from 'react';
import Ux from 'ux';
import {Input, InputNumber, Radio} from "antd";
import {TableEditor} from 'web';

class Component extends React.PureComponent {
    render() {
        const {config = {}, value = {}} = this.props;
        return Ux.xtForm([
            {
                ...config.endpoint, value: value.endpoint
            },
            {
                ...config.protocol, value: value.protocol ? value.protocol : "http",
                component: Radio,
            },
            [
                {...config.hostname, value: value.hostname},
                {
                    ...config.port, value: value.port,
                    component: InputNumber
                }
            ],
            [
                {...config.username, value: value.username},
                {
                    ...config.password, value: value.password,
                    component: Input.Password
                }
            ],
            {
                ...config['apis'], value: value['apis'],
                component: TableEditor
            }
        ], this)
    }
}

export default Component