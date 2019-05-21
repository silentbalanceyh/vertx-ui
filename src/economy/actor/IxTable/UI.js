import React from 'react';
import Op from './Op';
import Ux from "ux";
import {Table} from "antd";

class Component extends React.PureComponent {
    state = {
        table: {}
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {reference, $options = {}, $data = {}} = this.props;
        const {table = {}} = this.state;
        const $table = Op.configTable(reference, $options, table);
        return !Ux.isEmpty(table) ? (
            <Table {...$table} className={Ux.ECONOMY.TABLE_CONTROL}
                   dataSource={$data.list ? $data.list : []}/>
        ) : false;
    }
}

export default Component;