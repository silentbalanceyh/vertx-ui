import React from 'react'
import Ux from 'ux';
import {Icon, Input, Table} from "antd";
import {DynamicDialog} from "web";
import Op from './Op';

class Component extends React.PureComponent {

    state = Op.getDefault();

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey} = this.state;
        // 点击函数加载
        jsx.onClick = Ux.xt2Loading(this, config);
        // 窗口读取以及事件绑定
        const dialog = Op.getDialog(this, config);
        // 分页设置
        const pageAndChange = Ux.xtPager(this, config);
        // 配置处理
        config.table.columns = Ux.uiTableColumn(this, config.table.columns);
        // 属性拉平处理
        const attr = Ux.valueFlip(jsx);
        return (
            <span>
                <Input className="rx-readonly" readOnly {...attr}
                       suffix={<Icon type="search"
                                     onClick={Ux.xt2Loading(this, config)}/>}/>
                <DynamicDialog className="rx-list-dialog"
                               $visible={this.state.$visible}
                               $dialog={dialog}>
                    <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                           size={"small"}
                           loading={this.state.$loading}
                           rowSelection={Ux.xtSelection(this)}
                           {...pageAndChange}
                           {...config.table} dataSource={$data.list}/>
                </DynamicDialog>
            </span>
        )
    }
}

export default Component;
