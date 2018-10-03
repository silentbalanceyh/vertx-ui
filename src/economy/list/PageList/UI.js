import React from 'react';
import Ux from 'ux';
import './Cab.less';
import {Alert, Button, Table} from 'antd';
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
        const {$list = {}, $table = {}, $query = {}, $metadata = {}, $dialog = {}} = this.props;
        // columns渲染
        Ux.uiTableColumn(this, $table.columns, Op);
        // paginator处理
        const pagination = Ux.uiTablePager(this, $query.pager, $list.count);
        // selection
        const selection = $metadata.batch ? Ux.uiTableSelection(this) : undefined;
        // metadata处理
        const op = $metadata.op;
        const {selectedRowKeys = []} = this.state;
        const message = Ux.formatExpr($metadata.report.expr, {
            selected: selectedRowKeys.length,
            sum: 0
        });
        // 数据data
        const data = $list.list;
        const {$component: Component} = this.props;
        const dialog = this.state.dialogKey ? $dialog[this.state.dialogKey] : {};
        return (
            <div className="page-pagelist">
                <div className="page-op">
                    {op.add ? <Button type="primary" icon="plus"
                                      onClick={Op.fnAdd(this, op.add.dialogKey)}>{op.add.text}</Button> : false}
                    {0 < selectedRowKeys.length ? (
                        <Button type="default">{op.batch}</Button>
                    ) : false}
                </div>
                {($metadata.batch) ? (
                    <div className="page-alert">
                        <Alert message={(
                            <div>
                                {message}&nbsp;&nbsp;
                                <a onClick={Op.fnClear(this)}>{op.clear}</a>
                            </div>
                        )} type="info" showIcon/>
                    </div>
                ) : false}
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
        );
    }
}

export default Component;
