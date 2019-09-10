import React from 'react';
import './Cab.less';
import {Input, Table} from 'antd';
import Ux from 'ux';
import moment from 'moment';

const rxValue = (reference, value, config) => {
    if (config.items) {
        // 字符串格式比较
        const item = config.items.filter(item => String(value) === item.key);
        return 1 === item.length ? item[0].label : undefined;
    }
    if (moment.isMoment(value)) {
        // 时间信息处理
        return value.format(config.format);
    }
    if (config.columns) {
        const columns = Ux.uiTableColumn(Ux.onReference(reference, 1), config.columns);
        return (
            <Table dataSource={value} columns={columns} pagination={false}/>
        );
    }
    return value;
};

class Component extends React.PureComponent {

    render() {
        const {value, config, format, ...jsx} = this.props;
        // 是否一个Radio
        const $config = Ux.clone(config);
        if (format) {
            $config.format = format;
        }
        const literal = rxValue(this, value, $config);
        return (
            <Input.Group {...jsx} className={"magic-view-item"}>
                <span>{literal}</span>
            </Input.Group>
        );
    }
}

export default Component;