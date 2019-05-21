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

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.update(this, {prevProps, prevState});
    }

    render() {
        const {$options = {}} = this.props;
        const {table = {}, data = {}} = this.state;
        const $table = Op.configTable(this, $options, table);
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxTable：", "#06c");
        return !Ux.isEmpty(table) ? (
            <Table {...$table}
                   className={Ux.ECONOMY.TABLE_CONTROL}
                   dataSource={data.list ? data.list : []}/>
        ) : false;
    }
}

export default Component;