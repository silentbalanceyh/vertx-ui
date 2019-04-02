import React from 'react';
import Ux from 'ux';
import {Icon, Input, Table} from "antd";
import {DynamicDialog} from "web";
import Op from './Op';
import '../../../global.less';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Op.getDefault(this);
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey} = this.state;
        const {onClick, dialog, table = {}} = this.state ? this.state : {};
        jsx.onClick = onClick;
        // 页码处理，分页是需要根据数据来的，必须通过data来计算
        const pageAndChange = Ux.xtPager(this, config);
        // 属性拉平处理
        const attr = Ux.valueFlip(jsx);
        return (
            <span>
                <Input className="ux-readonly"
                       readOnly {...attr}
                       suffix={<Icon type="search" onClick={onClick}/>}/>
                <DynamicDialog className="web-dialog"
                               size={"small"}
                               $visible={this.state.$visible}   // 窗口是否开启
                               $dialog={dialog}>
                        <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                               loading={this.state.$loading}
                               {...config.table} // 原始配置信息
                               {...table} // 处理过的表格信息
                               {...pageAndChange} // 处理分页处理
                               bordered={false}
                               className={"web-table"}
                               dataSource={$data.list}/>
                </DynamicDialog>
            </span>
        );
    }
}

export default Component;
