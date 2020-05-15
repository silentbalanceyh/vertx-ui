import React from 'react';
import Ux from 'ux';
import {Input, InputNumber} from 'antd';
import Op from './op';

class Component extends React.PureComponent {
    render() {
        const {config = {}, value = {}} = this.props;
        return Ux.xtForm([
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
            [
                {...config.instance, value: value.instance},
                {
                    ...config.category, value: value.category,
                    onChange: Op.onSelect(this, 'category', config.category)
                }
            ],
            {
                ...config['driverClassName'], value: value['driverClassName'],
                component: Op.jsxDriver(this, config['driverClassName'])
            },
            {
                ...config['jdbcUrl'], value: value['jdbcUrl']
            }
        ], this)
    }
}

export default Component