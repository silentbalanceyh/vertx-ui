import React from 'react'
import {Input} from 'antd';
import moment from 'moment';
import Immutable from 'immutable';

const rxValue = (value, config) => {
    if (config.items) {
        // 字符串格式比较
        const item = config.items.filter(item => String(value) === item.key);
        return 1 === item.length ? item[0].label : undefined
    }
    if (moment.isMoment(value)) {
        // 时间信息处理
        return value.format(config.format);
    }
    if (config.columns) {
        console.info(config.columns, value);
        return <span></span>
    }
    return value;
};

class Component extends React.PureComponent {

    render() {
        const {value, config, format, ...jsx} = this.props;
        // 是否一个Radio
        const $config = Immutable.fromJS(config).toJS();
        if (format) {
            $config.format = format;
        }
        const literal = rxValue(value, $config);
        return (
            <Input.Group {...jsx} className={"magic-view-item"}>
                <span>{literal}</span>
            </Input.Group>
        )
    }
}

export default Component