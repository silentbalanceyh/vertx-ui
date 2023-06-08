import React from 'react';
import {Col, Input, Row, Table, Tag, Tree} from 'antd';
import Ux from 'ux';
import Op from './Op';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderTree: (reference) => {
        const {$tree = {}} = reference.state;
        const {treeData = {}} = $tree;

        const treeAttrs = {};
        treeAttrs.treeData = treeData;
        treeAttrs.checkable = true;
        treeAttrs.selectable = false;
        treeAttrs.defaultExpandAll = true;
        return (
            <Tree {...treeAttrs} onCheck={Op.rxTree(reference)}/>
        )
    },
    renderTable: (reference) => {
        let {$table = {}, $data = [], $loading = false, $selected = []} = reference.state;
        $table = Ux.clone($table);
        $table.rowSelection = {
            onChange: Ux.rxCheckedRow(reference),
            selectedRowKeys: $selected.map(selected => selected.key),
            // 选中设置
            getCheckboxProps: Op.yoSelection(reference)
        }
        $table.columns = Ux.configColumn(reference, $table.columns);
        // 选中项设置
        const dataSource = Ux.clone($data);
        return (
            <Table {...$table} dataSource={dataSource} loading={$loading}/>
        )
    },
    renderSearch: (reference) => {
        const {$search = {}, $tip = {}} = reference.state;
        const {label, condition, ...rest} = $search;
        return (
            <Row className={"search-bar"}>
                <Col span={2} className={"title"}>
                    {label}
                </Col>
                <Col span={4}>
                    <Input.Search {...rest} onChange={Op.rxKeyword(reference, condition)}
                                  onSearch={event => {
                                      Ux.prevent(event);
                                      Ux.of(reference).loading(false).done();
                                      // reference.?etState({$loading: true})
                                  }}/>
                </Col>
                <Col span={18} className={"tip"}>
                    <Tag style={{
                        fontSize: 14
                    }} color={"magenta"}>
                        {$tip.message}
                    </Tag>
                </Col>
            </Row>
        )
    }
}