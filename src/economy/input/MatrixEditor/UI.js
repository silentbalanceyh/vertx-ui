import React from 'react';
import './Cab.less';
import Op from './Op';
import {Input, Table} from "antd";

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        // data专用：MatrixEditor是固定行
        const state = Op.initData(this);
        // columns专用
        state.table = Op.initTable(this);
        this.state = state;
    }

    render() {
        const {table = {}, data = []} = this.state ? this.state : {};
        // 配置处理
        table.pagination = false;
        table.className = "web-table-editor";
        // 数据本身
        return (
            <Input.Group>
                <Table {...table}
                       dataSource={data}/>
            </Input.Group>
        );
    }
}

export default Component;