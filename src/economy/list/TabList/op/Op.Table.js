import Ux from "ux";
import Act from "./Op.Action";
import Init from './Op.Init';
import Fn from '../../../_internal/Ix.Fn';
import U from "underscore";
import {Button, Tooltip} from "antd";
import React from "react";

const {Mock} = Fn;
const _initTablePager = (reference = {}) => {
    const data = initData(reference);
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
    };
    pagination.total = data.count;
    const {$query} = reference.props;
    if ($query.is()) {
        const query = $query.to();
        const pager = query.pager ? query.pager : {
            size: 10,
            page: 1
        };
        pagination.pageSize = pager.size ? pager.size : 10;
        pagination.current = pager.page ? pager.page : 1;
        return pagination;
    }
};

const _initChange = (reference = {}) => (pagination, filter, sorter) => {
    // 分页
    const query = Init.readQuery(reference);
    query.pager.page = pagination.current;
    query.pager.size = pagination.pageSize;
    // 排序
    if (sorter.field) {
        const field = sorter.field;
        const desc = "descend" === sorter.order ? "DESC" : "ASC";
        query.sorter = [`${field},${desc}`];
    }
    const updated = Fn.isGridUpdated(reference, query, sorter.column);
    if (updated) {
        // 处理Query信息
        reference.setState({$query: query});
        // 变更之前如果是Mock环境则需要清掉Mock中的ready
        const {mock, mocker} = reference.state;
        if (mock && mocker) {
            // 将Mocker清空，只是在Mock环境下保留Loading效果而已
            reference.setState({mocker: undefined});
        }

        Ux.writeTree(reference, {
            "grid.list": undefined,
            "grid.query": query
        });
    }
};

const initData = (reference) => {
    const {$list} = reference.props;
    if ($list) {
        const ready = $list.is();
        const data = $list.is() ? $list.to() : {};
        if (U.isArray(data.list)) {
            return {ready, ...data};
        } else {
            return {list: [], count: 0, ready};
        }
    } else {
        return {list: [], count: 0, ready: false};
    }
};
const _isDisabledAdd = (reference) => {
    const options = Init.readOption(reference);
    // 是否禁用快速添加，$fastAdd为启用添加，默认启用
    let disabled = false;
    if (reference.props.hasOwnProperty('$fastAdd')) {
        // 以传入值为主
        disabled = reference.props['$fastAdd'];
    } else {
        // 以默认值为主
        if (options['row.add.leaf']) {
            // 如果开启了叶节点才能执行，则默认为false，反向取值
            disabled = !options['row.add.leaf'];
        }
    }
    return disabled;
};
const initAdd = (reference, column) => {
    const options = Init.readOption(reference);
    if (options["row.add"]) {
        const tip = options["row.add"];

        return (
            <Tooltip title={tip ? tip : false}>
                <Button icon={"plus"} type="primary"
                        disabled={_isDisabledAdd(reference)}
                        onClick={event => {
                            event.preventDefault();
                            reference.setState({
                                rowKey: Ux.randomUUID()
                            });
                        }}>{tip}</Button>
            </Tooltip>
        );
    } else return column.title;
};
const initRow = (reference, columns = [], rowKey) => {
    columns.forEach(column => {
        if (column.edit) {
            const fnRender = column.render;
            column.render = (text, record, index) => {
                if (record.key === rowKey) {
                    let type = column.edit["$render"];
                    if (!type) type = "TEXT";
                    const fnRender = Ux.aiStateRenders[type];
                    return U.isFunction(fnRender) ?
                        fnRender(reference, column)(text, record, index) : false;
                } else {
                    return U.isFunction(fnRender) ?
                        fnRender(text, record, index) : text;
                }
            };
        }
    });
    return columns;
};
const initTable = (reference = {}) => {
    let table = Init.readTable(reference);
    table = Ux.clone(table);
    // 列渲染
    const props = reference.props;
    // 行添加专用
    const {rowKey} = reference.state;
    const op = {
        rxEdit: Act.rxEdit,
        rxDelete: Act.rxDelete,
        rxSave: Act.rxSave,
        rowKey,
        rxCancel: () => reference.setState({rowKey: undefined})
    };
    table.columns = Ux.uiTableColumn({
        props: {
            // 当前引用对应的props属性
            ...props,
            // 专用的rxEdit/rxDelete的Api调用专用数据
            ...op,
            // 当前组件引用
            $self: reference
        },
    }, table.columns);
    table.columns.filter(column => "key" === column.dataIndex)
        .forEach(column => column.title = initAdd(reference, column));
    if (rowKey) {
        table.columns = initRow(reference, table.columns, rowKey);
    }
    // 分页处理，客户端模式
    table.pagination = _initTablePager(reference);
    table.onChange = _initChange(reference);
    let data = initData(reference);
    data = Mock.mockConnect(reference, data);
    // 设置ready单独
    const {$list} = reference.props;
    data.ready = $list && $list.is();
    // Mock链接处理
    return {table, data: data.list, ready: data.ready};
};
export default {
    initTable
};