import React from 'react';
import Op from './Op';
import Ux from "ux";
import {Table} from "antd";

/*
 * 这里必须加以说明
 * State
 * 1 . $condition 保存了列引起的查询条件的变更
 * 2 . $stateSorter 表示当前排序使用"可控"的模式
 * Props
 * 1 . $query 保存了从外层处理的查询条件
 */
class Component extends React.PureComponent {
    state = {
        table: {},
        $stateSorter: true,   // 排序修改成可控
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