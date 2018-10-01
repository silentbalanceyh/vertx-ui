import React from 'react'
import Op from './Op'
import {Table} from 'antd';
import {PageCard} from "web";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.initTable(this);
    }

    render() {
        const {table, data = []} = this.state ? this.state : {};
        console.info(this.state);
        if (table) {
            return (
                <Table {...table} dataSource={data}/>
            )
        } else return false;
    }
}

export default Component