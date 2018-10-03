import React from 'react';
import Ux from 'ux';
import {Icon, Input, Table} from "antd";
import {DynamicDialog} from "web";
import Op from './Op';

class Component extends React.PureComponent {

    state = Op.getDefault();

    componentDidMount() {
        // onClick事件
        const {config = {}} = this.props;
        // 核心配置处理
        const onClick = Ux.xt2Loading(this, config);
        const dialog = Op.getDialog(this, config);
        const columns = Ux.uiTableColumn(this, config.table.columns);
        const rowSelection = Ux.xtSelection(this);
        // 合并配置信息
        this.setState({
            onClick, dialog, ready: true,
            table: {columns, rowSelection}
        });
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey, ready = false} = this.state;
        if (ready) {
            const {onClick, dialog, table = {}} = this.state;
            jsx.onClick = onClick;
            // 页码处理，分页是需要根据数据来的，必须通过data来计算
            const pageAndChange = Ux.xtPager(this, config);
            // 属性拉平处理
            const attr = Ux.valueFlip(jsx);
            return (
                <span>
                    <Input className="rx-readonly"
                           readOnly {...attr}
                           suffix={<Icon type="search" onClick={onClick}/>}/>
                    <DynamicDialog className="rx-list-dialog"
                                   $visible={this.state.$visible}   // 窗口是否开启
                                   $dialog={dialog}>
                        <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                               size={"small"}
                               loading={this.state.$loading}
                               {...config.table} // 原始配置信息
                               {...table} // 处理过的表格信息
                               {...pageAndChange} // 处理分页处理
                               dataSource={$data.list}/>
                    </DynamicDialog>
                </span>
            );
        } else return false;
    }
}

export default Component;
