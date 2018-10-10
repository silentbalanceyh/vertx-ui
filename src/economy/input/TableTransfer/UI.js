import React from 'react';
import './Cab.less';
import Ux from "ux";
import {Input, Table} from "antd";
import Op from './Op';
import Rdr from './UI.Render';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Op.getInit(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        const {table = {}, config = {}, ...jsx} = this.state;
        // 根据Filter计算双重数据源
        const fromData = Op.getFrom(this, config);
        const toData = Op.getTo(this, config);
        // 处理InputGroup中的jsx
        const attrs = Ux.valueFlip(jsx);
        const $attrs = Ux.clone(attrs);
        console.info(table.columns);
        return (
            <Input.Group {...$attrs} className={"web-table-transfer"}>
                <Table {...table} dataSource={toData}/>
                {Rdr.renderFilter(this)}
                <Table {...table} dataSource={fromData}/>
            </Input.Group>
        );
    }
}

export default Component;