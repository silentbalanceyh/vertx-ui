import Ux from "ux";
import {Input, Popconfirm, Table, Tree} from "antd";
import React from "react";
import Op from "./Op";

const _normalized = (reference) => {
    const {data = [], config = {}} = reference.props;
    const {$keyword} = reference.state;
    if ($keyword && Ux.isArray(config.filter)) {
        const fields = config.filter;
        const treeConfig = Ux.toTreeConfig(config.tree);
        const firstHit = data.filter(item => {
            const hit = fields.map(field => {
                return item[field] && 0 < item[field].indexOf($keyword);
            }).filter(item => item);
            return 0 < hit.length;
        });
        const combine = [];
        const addKeys = [];
        firstHit.forEach(hit => {
            const branch = Ux.elementBranch(data,
                hit[treeConfig.key], treeConfig.parent);
            branch.forEach(each => {
                if (!addKeys.includes(each[treeConfig.key])) {
                    addKeys.push(each[treeConfig.key]);
                    combine.push(each);
                }
            })
        })
        return combine;
    } else {
        return Ux.clone(data)
    }
}
export default {
    renderSearch: (reference) => {
        const {config = {}} = reference.props;
        const {search = {}} = config;
        return (
            <Input.Search className={"search"} {...search}
                          allowClear
                          onSearch={Op.rxSearch(reference)}/>
        )
    },
    renderTree: (reference) => {
        const {config = {}} = reference.props;
        // Filter
        const $data = _normalized(reference);
        // Tree
        const field = config.checkable;
        $data.forEach(each => {
            each.checkable = !!each[field];
            each.selectable = false;
        })
        const treeData = Ux.toTree($data, config.tree);
        const {value = []} = reference.props;
        const checked = value.map(item => item.key);
        return (
            <Tree treeData={treeData} defaultExpandAll
                  checkedKeys={checked}
                  onCheck={Op.rxTree(reference)}
                  checkable/>
        )
    },
    renderTable: (reference) => {
        const {config, value = []} = reference.props;
        const {table = {}} = config;
        const $table = Ux.clone(table);
        $table.className = "web-table table";
        $table.pagination = false;
        $table.columns = Ux.configColumn(reference, $table.columns);
        $table.columns.forEach(column => {
            if ("key" === column.dataIndex) {
                column.render = (key) => {
                    const {$config = {}} = column;
                    const {confirm, text} = $config;
                    if (confirm) {
                        return (
                            <Popconfirm title={confirm}
                                        onConfirm={Op.rxDelete(reference, key)}>
                                {/* eslint-disable-next-line */}
                                <a href={""}>{text}</a>
                            </Popconfirm>
                        )
                    } else {
                        return (
                            // eslint-disable-next-line
                            <a href={""} onClick={Op.rxSearch(reference, key)}>{text}</a>
                        )
                    }
                }
            }
        })
        return (
            <Table {...$table} dataSource={value}/>
        )
    }
}