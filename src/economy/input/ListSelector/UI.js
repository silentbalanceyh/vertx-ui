import React from 'react';
import Ux from 'ux';
import {Icon, Input, Table} from "antd";
import {DynamicDialog} from "web";
import Op from './Op';

class Component extends React.PureComponent {

    state = Op.getDefault();

    componentDidMount() {
        this.hoc = Op.getHoc(this);
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey} = this.state;
        const {onClick, dialog, table = {}} = this.hoc ? this.hoc : {};
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
    }
}

export default Component;
