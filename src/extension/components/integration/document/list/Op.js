import Ux from "ux";
import React from "react";
import Rdr from './Web.Column';

const yiList = (reference, state = {}, keyRender) => {
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    const columns = Ux.configColumn(reference, table.columns);
    columns.forEach(column => {
        const {config = {}} = column;
        // name 渲染
        if ("name" === column.dataIndex) {
            column.sorter = Ux.sorterAscTFn("name");
            column.render = Rdr.renderName(reference);
        }
        // size 渲染
        if ("size" === column.dataIndex) {
            column.sorter = Ux.sorterAscTFn("size");
            column.render = Rdr.renderSize(reference);
        }
        // updatedAt
        if ("updatedAt" === column.dataIndex) {
            column.sorter = Ux.sorterAscDFn("updatedAt");
        }
        // createdBy
        if ("createdBy" === column.dataIndex) {
            column.render = Rdr.renderCreatedBy(reference, config);
        }
        // key 操作列
        if ("key" === column.dataIndex) {
            column.render = keyRender(reference, config);
        }
    })
    $table.columns = columns;
    state.$table = $table;
    return Ux.promise(state);
}
const yoRowSelection = (table = {}, reference, isTrash = false) => {
    const {$selectedKeys = []} = reference.props;      // 选中项
    if (isTrash) {
        // 回收站中的所有内容都可以选中执行返回
        table.rowSelection = {
            selectedRowKeys: $selectedKeys,
            onChange: (keys = []) => Ux.fn(reference).rxRowSelect(keys)
        }
    } else {
        /*
         * 非回收站中的条件
         * 1. 当前记录必须支持 w 操作
         * 2. 该目录本身必须支持 x 操作
         */
        const {$directory = {}} = reference.props;
        const dirVisit = $directory.visitMode ? $directory.visitMode : [];
        if (dirVisit.includes("w")) {
            table.rowSelection = {
                selectedRowKeys: $selectedKeys,
                onChange: (keys = []) => Ux.fn(reference).rxRowSelect(keys),
                getCheckboxProps: (record) => {
                    const {visitMode = []} = record;
                    const props = {};
                    props.disabled = !visitMode.includes("x");
                    return props;
                }
            }
        }
    }
    return table;
}
export default {
    yiList,
    yoRowSelection,
}