import React from 'react'
import Op from './Op'
import {Table} from 'antd';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.initTable(this);
    }

    render() {
        const {table, data = []} = this.state ? this.state : {};
        if (table) {
            return (
                <Table {...table} dataSource={data}/>
            )
        } else return false;
    }
}

export default Component