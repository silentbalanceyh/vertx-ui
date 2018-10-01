import {Progress} from "antd";
import React from "react";
import Ux from "ux";
import U from "underscore";

const _calcLayout = (index, width = "") => {
    const widthes = width.split(",").map(item => Ux.valueInt(item));
    const layouts = [];
    widthes.forEach((item, current) => {
        for (let idx = 0; idx < item; idx++) {
            const layout = {};
            layout.key = Ux.randomUUID();
            layout.percent = index === current ? 99 : 0;
            layout.showInfo = false;
            layouts.push(layout);
        }
    });
    return layouts;
};

const _formatColumn = (columns = []) => {
    columns.forEach(column => {
        if ("sequence" === column.dataIndex) {
            column.render = (text) => (text ? (<span>（行号 = {text}）</span>) : false)
        }
        if ("index" === column.dataIndex) {
            column.render = (text) => (
                <span style={{color: "red"}}>{undefined !== text ? text : false}</span>)
        }
        if ("span" === column.dataIndex) {
            column.render = (text) => (text) ? (
                <span>
                    {(9 < text ? text : `0${text}`)}
                    （ span = {text} ）
                </span>
            ) : ""
        }
        if ("width" === column.dataIndex) {
            column.render = (text, record) => {
                const layouts = _calcLayout(record.index, text);
                const _fnStyle = (item, index) => {
                    const style = {};
                    const position = (index + 1);
                    if (0 === position % 4) {
                        style.marginRight = 20;
                    } else if (0 === position % 2) {
                        style.marginRight = 3;
                    }
                    style.width = 20;
                    return style;
                };
                return layouts.map((item, index) => (
                    <Progress {...item} style={_fnStyle(item, index)}/>));
            };
            column.className = "web-layout-demo"
        }
    })
};

const _calcData = (data = []) => {
    const result = [];
    data.forEach((each, index) => {
        const item = {};
        item.sequence = index + 1;
        item.key = Ux.randomUUID();
        item.column = each.column;
        if (U.isArray(each.children)) {
            const childrArray = [];
            each.children.forEach(child => {
                if ("string" === typeof child) {
                    const splitted = child.split('`');
                    const children = {};
                    children.name = splitted[0];
                    children.index = Ux.valueInt(splitted[1]);
                    children.span = Ux.valueInt(splitted[2]);
                    children.width = splitted[3];
                    children.key = Ux.randomUUID();
                    childrArray.push(children);
                } else {
                    child.key = Ux.randomUUID();
                    childrArray.push(child);
                }
            });
            item.children = childrArray;
        } else {
            item.children = each.children;
        }
        result.push(item);
    });
    return result;
};

const initData = (reference) => {
    const data = Ux.fromHoc(reference, "data");
    return _calcData(data);
};
const initTable = (reference) => {
    const ref = Ux.onReference(reference, 1);
    const table = Ux.fromHoc(ref, "table");
    const attrs = {};
    attrs.defaultExpandAllRows = false;
    attrs.pagination = false;
    Object.assign(attrs, table);
    _formatColumn(attrs.columns);

    const data = initData(ref);
    reference.setState({table: attrs, data});
};
export default {
    initTable
}