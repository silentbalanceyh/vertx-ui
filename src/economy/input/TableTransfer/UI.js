import React from 'react';
import './Cab.less';
import Ux from "ux";
import {Input, Table} from "antd";
import Op from './Op';
import Filter from './UI.Filter';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Op.getInit(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    componentDidUpdate(prevProps) {
        const value = this.props.value;
        if (!value) {

        }
    }

    render() {
        console.info(this.props, this.state);
        const {fromTable = {}, toTable = {}, config = {}, ...jsx} = this.state;
        // 根据Filter计算双重数据源
        const from = Op.getFrom(this, config, fromTable);
        const to = Op.getTo(this, config, toTable);
        // 处理InputGroup中的jsx
        const attrs = Ux.valueFlip(jsx);
        const $attrs = Ux.clone(attrs);
        return (
            <Input.Group {...$attrs} className={"web-table-transfer"}>
                <Table {...fromTable} dataSource={from}/>
                <Filter config={config} reference={this}/>
                <Table {...toTable} dataSource={to}/>
            </Input.Group>
        );
    }
}

export default Component;