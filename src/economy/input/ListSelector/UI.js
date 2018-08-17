import React from 'react'
import Ux from 'ux';
import {Icon, Input, Table} from "antd";
import {DynamicDialog} from "web";

class Component extends React.PureComponent {

    state = Ux.jslInit();

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey} = this.state;
        jsx.onClick = Ux.jslLoading(this, config);
        // 窗口
        const dialog = Ux.jslDialog(this, config);
        // 客户端分页？
        const pageAndChange = Ux.jslPager(this, config);
        // 配置处理
        if (config.table.columns) {
            config.table.columns = Ux.uiTableColumn(this, config.table.columns)
        }
        const attr = Ux.valueFlip(jsx);
        return (
            <span>
                <Input className="rx-readonly" readOnly {...attr}
                       suffix={<Icon type="search" onClick={Ux.jslLoading(this, config)}/>}/>
                <DynamicDialog className="rx-list-dialog"
                               $visible={this.state.$visible}
                               $dialog={dialog}>
                    <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                           size={"small"}
                           loading={this.state.$loading}
                           rowSelection={Ux.jslSelection(this)}
                           {...pageAndChange}
                           {...config.table} dataSource={$data.list}/>
                </DynamicDialog>
            </span>
        )
    }
}

export default Component;
