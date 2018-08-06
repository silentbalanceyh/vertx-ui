import React from 'react'
import Ux from 'ux';
import {Button, Icon, Input, Table} from "antd";
import {DynamicDialog} from "web";
import Op from './Op'

const uiSelection = (reference) => ({
    type: 'radio',
    onSelect: keys => {
        reference.setState({$select: keys})
    }
});

const uiPagination = (reference) => {
    const {$data = {}} = reference.state;
    const {config = {}} = reference.props;
    const pagination = {
        showQuickJumper: true
    };
    pagination.total = $data.count;
    if (config.ajax && config.ajax.params) {
        const pager = config.ajax.params.pager;
        if (pager) {
            pagination.pageSize = pager.size;
            pagination.current = pager.page;
        } else {
            console.error("[COA] Please provide 'pager' in parameter list.");
        }
    }
    return pagination;
};

class Component extends React.PureComponent {

    state = {
        $visible: false,
        $loading: false,
        $data: [],
        $select: undefined,
    };

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey} = this.state;
        const dialog = Ux.aiExprWindow(config.window);
        jsx.onClick = Op.fnLoading(this);
        // Footer关闭窗口
        dialog.footer = (
            <span>
                <Button icon="check" className="ux-success"
                        onClick={Op.fnSelect(this)}>{dialog.okText}</Button>
                <Button icon="close" type="danger"
                        onClick={Op.fnDialog(this, false)}>{dialog.cancelText}</Button>
            </span>
        );
        dialog.onCancel = Op.fnDialog(this, false);
        // 客户端分页？
        const pageAndChange = {};
        if ("client" !== config.pagination) {
            pageAndChange.onChange = Op.fnChange(this);
            pageAndChange.pagination = uiPagination(this);
        } else {
            pageAndChange.pagination = true;
        }
        // 配置处理
        if (config.table.columns) {
            config.table.columns = Ux.uiTableColumn(this, config.table.columns)
        }
        return (
            <span>
                <Input className="rx-readonly" readOnly {...jsx}
                       suffix={<Icon type="search" onClick={Op.fnLoading(this)}/>}/>
                <DynamicDialog className="rx-list-dialog"
                               $visible={this.state.$visible}
                               $dialog={dialog}>
                    <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                           size={"small"}
                           loading={this.state.$loading}
                           rowSelection={uiSelection(this)}
                           {...pageAndChange}
                           {...config.table} dataSource={$data.list}/>
                </DynamicDialog>
            </span>
        )
    }
}

export default Component;
