import React from 'react'
import Ux from 'ux';
import './Cab.less'
import {Button, Input, Table} from 'antd'
import {DynamicDialog} from "web";
import Op from './UI.Op';

class Component extends React.PureComponent {
    state = {
        selectedRowKeys: [],
        dialogKey: undefined,
        selectedKey: undefined
    };

    componentDidMount() {
        Ux.cycleUpdatePageList(this, "list");
    }

    componentDidUpdate(prevProps) {
        Ux.cycleUpdatePageList(this, "list", prevProps);
    }

    render() {
        const {$list = {}, $table = {}, $query = {}, $metadata = {}, $dialog = {}, $op = {}} = this.props;
        // columns渲染
        Ux.uiTableColumn(this, $table.columns, Op);
        // paginator处理
        const pagination = Ux.uiTablePager(this, $query.pager, $list.count);
        // selection
        const selection = $metadata.batch ? Ux.uiTableSelection(this) : undefined;
        // metadata处理
        const op = $metadata.op;
        const dynamic = op['dynamic'] ? op['dynamic'] : [];
        // 数据data
        const data = $list.list;
        const {$component: Component} = this.props;
        const dialog = this.state.dialogKey ? $dialog[this.state.dialogKey] : {};
        return (
            <div className="page-pagelist">
                <div className="page-op">
                    <Button type="primary" icon="plus"
                            onClick={Op.fnAdd(this, op.add.dialogKey)}>{op.add.text}</Button>
                    {dynamic ? dynamic.map(item => {
                        const attrs = {};
                        attrs.key = item.key;
                        if (item.icon) attrs.icon = item.icon;
                        if (item.hasOwnProperty("fnKey")) {
                            attrs.onClick = $op[item['fnKey']] ? $op[item['fnKey']] : () => {
                            }
                        }
                        return (
                            <Button {...attrs}>{item.text}</Button>
                        );
                    }) : false}
                    {op.search ? (
                        <Input.Search style={{width: 160, float: "right"}}/>
                    ) : false}
                </div>
                <Table
                    onChange={Ux.onAdvanced(this)}
                    rowSelection={selection}
                    loading={!data}
                    pagination={pagination}
                    dataSource={data} {...$table}/>
                <DynamicDialog $dialog={dialog} $visible={dialog.visible}>
                    <Component {...this.props} $destory={!dialog.visible}
                               $key={this.state.selectedKey} {...Ux.toDatum(this.props)}/>
                </DynamicDialog>
            </div>
        )
    }
}

export default Component;
