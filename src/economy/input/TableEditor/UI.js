import React from 'react'
import './Cab.less'
import {Input, Table} from 'antd';
import Ux from 'ux';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Ux.xtInitArray(props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        // 配置处理
        config.columns = Ux.xtColumn(this, config.columns);
        config.pagination = false;
        config.className = "web-table-editor";
        // 数据处理
        const data = Ux.xtSource(this);
        return (
            <Input.Group {...jsx}>
                <Table {...config}
                       dataSource={data}/>
            </Input.Group>
        )
    }
}

export default Component;