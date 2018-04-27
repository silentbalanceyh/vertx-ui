import React, { Fragment } from "react";
import { Popconfirm, Divider } from "antd";
import Ux from "ux";
import Immutable from "immutable";

const uiLogical = (reference, config) => text => {
    return (
        <span>{ text ? config.$mapping["true"] : config.$mapping["false"] }</span>
    );
};
const uiPercent = (reference, config) => text => {
    return (
        <span>{ Ux.fmtPercent(text) }</span>
    )
};
const uiDate = (reference, config) => text => {
    return <span>{ Ux.formatDate(text, config.$format) }</span>;
};
const uiCurrency = (reference, config = {}) => text => {
    const flag = config.flag ? config.flag : "￥";
    return <span>{ flag }{ Ux.fmtCurrency(text) }</span>;
};
const uiExpression = (reference, config) => text => {
    return <span>{ Ux.formatExpr(config.$expr, {value : text}) }</span>;
};
const uiDatum = (reference, config) => text => {
    const datum = config.$datum;
    const data = Ux.onDatum(reference, datum.source);
    const item = Ux.elementUnique(data, datum.value, text);
    return <span>{ item ? item[datum.display] : false }</span>;
};
const uiLink = (reference, config, ops = {}) => text => {
    return (
        <Fragment>
            { config.$config.map((line, opIndex) => {
                // 编辑专用，配置信息需要拷贝，才可不同
                const item =
                    "string" === typeof line
                        ? line
                        : Immutable.fromJS(line).toJS();
                // 按钮onClick专用
                if (item.onClick) {
                    const fn = ops[item.onClick];
                    if (fn)
                        item.onClick = fn(reference, item.dialogKey)(
                            line,
                            text
                        );
                }
                // Confirm窗口中的Yes
                if (item.confirm && item.confirm.onConfirm) {
                    const fn = ops[item.confirm.onConfirm];
                    if (fn) item.confirm.onConfirm = fn(reference)(line, text);
                }
                return "string" === typeof item ? (
                    <Divider type="vertical" key={ `${item}${opIndex}` }/>
                ) : item.confirm ? (
                    <Popconfirm key={ item.key } { ...item.confirm }>
                        <a>{ item.text }</a>
                    </Popconfirm>
                ) : (
                    <a key={ item.key } onClick={ item.onClick }>
                        { item.text }
                    </a>
                );
            }) }
        </Fragment>
    );
};
const RENDERS = {
    LOGICAL : uiLogical,
    DATE : uiDate,
    CURRENCY : uiCurrency,
    EXPRESSION : uiExpression,
    LINK : uiLink,
    DATUM : uiDatum,
    PERCENT : uiPercent
};
const uiTableColumn = (reference, columns = [], ops = {}) => {
    columns.forEach(column => {
        if (column.hasOwnProperty("$render")) {
            const fnRender = RENDERS[column["$render"]];
            if (fnRender) {
                column.render = fnRender(reference, column, ops);
            }
        }
    });
    return columns;
};
const uiTablePager = (reference, pager = {}, count = 0) => {
    const pagination = {
        showSizeChanger : true,
        showQuickJumper : true
    };
    pagination.total = count;
    pagination.pageSize = pager.size ? pager.size : 10;
    pagination.current = pager.page ? pager.page : 1;
    return pagination;
};
const uiTableSelection = reference => {
    const {selectedRowKeys = []} = reference.state;
    return {
        selectedRowKeys,
        onChange : keys => {
            // Selected Keys
            reference.setState({selectedRowKeys : keys});
        },
        getCheckboxProps : record => ({
            disabled : record.disabled
        })
    };
};
export default {
    uiTableColumn,
    uiTablePager,
    uiTableSelection
};
