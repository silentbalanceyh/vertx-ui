import React from 'react'
import './Cab.less'
import {Table} from 'antd'
import Op from './Op';

class Component extends React.PureComponent {

    render() {
        const {
            $table = {
                columns: []
            }, data = []
        } = this.props;
        const attrs = {};
        attrs.pagination = false;
        attrs.bordered = true;
        // 动态渲染
        const processed = Op.initData(this, $table, data);
        return (
            <Table {...processed.table} {...attrs} className={"web-table"}
                   dataSource={processed.data}/>
        )
    }
}

export default Component