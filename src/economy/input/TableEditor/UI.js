import React from 'react';
import './Cab.less';
import {Input, Table} from 'antd';
import Ux from 'ux';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        const state = Ux.xtInitArray(props);
        // columns专用
        const {config = {}} = props;
        state.columns = Ux.xtColumn(this, config.columns);
        this.state = state;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {columns = []} = this.state ? this.state : {};
        // 配置处理
        config.columns = columns;
        config.pagination = false;
        // 不配置className时才处理，size处理
        if (!config.hasOwnProperty('className')) {
            config.className = "web-table-editor";
        }
        // 数据处理
        const data = Ux.xtData(this);
        // 处理InputGroup中的jsx
        const attrs = Ux.valueFlip(jsx);
        const $attrs = Ux.clone(attrs);
        if ($attrs.onChange) delete $attrs.onChange;
        // 是否处理children节点，新特性
        let $data = Ux.clone(data);
        if (config.hasOwnProperty('children') &&
            !config.children) {
            // 不渲染子节点
            $data.filter(item => item.hasOwnProperty('children'))
                .forEach(item => delete item.children);
        }
        return (
            <Input.Group {...$attrs}>
                <Table {...config}
                       dataSource={$data}/>
            </Input.Group>
        );
    }
}

export default Component;