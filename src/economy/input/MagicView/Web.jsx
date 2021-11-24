import React from 'react';
import {Icon, Table} from 'antd';
import JsonView from 'react-json-view';
import Ux from 'ux';
import U from 'underscore';
import {ColumnUser} from "web";
import {saveAs} from 'file-saver';

const jsxMoment = (reference, value, config = {}) => {
    // 时间信息处理
    const formatted = value.format(config.format);
    return jsxLabel(reference, formatted, config);
};
const jsxItems = (reference, value, config = {}) => {
    let item = Ux.elementUnique(config.items, "key", value);
    if (!item) {
        item = Ux.elementUnique(config.items, "key", String(value));
    }
    if (item) {
        const label = item.label;
        if (label) {
            const normalized = label.split(":");
            if (1 === normalized.length) {
                return jsxLabel(reference, label, config);
            } else if (2 === normalized.length) {
                const type = normalized[1];
                const text = normalized[0];
                return (
                    <span>
                        {jsxIcon(reference, type, item.style)}
                        &nbsp;&nbsp;
                        {jsxLabel(reference, text, {})}
                    </span>
                )
            }
        }
        return false;
    } else return false;
};
const jsxRecord = (reference, value, config = {}) => {
    const {rxRecord = data => data} = config;
    const normalized = rxRecord(value);
    const attrs = {};
    attrs.src = normalized.record;
    attrs.style = {fontSize: 12};       // 默认使用小字
    attrs.indentWidth = 8;
    return (
        <span>
            {normalized.prefix ? (
                <div style={{
                    marginBottom: 8
                }}>{normalized.prefix}</div>
            ) : false}
            {U.isObject(normalized.record) ? (
                <JsonView {...attrs}/>
            ) : false}
        </span>
    );
};
const jsxLabel = (reference, value, config = {}) => {
    const {smartFile = false} = config;
    let children;
    if (Ux.isObject(value)) {
        children = JSON.stringify(value)
    } else {
        if (smartFile && Ux.isNumber(value)) {
            children = Ux.toFileSize(value);
        } else {
            children = value;
        }
    }
    return (<span>{children}</span>);
}
const jsxIcon = (reference, icon, style = {}) => (<Icon type={icon} style={style}/>);
const jsxUser = (reference, value, config = {}) => {
    const {user = {}, $empty = ""} = config;
    const attrs = {};
    attrs.config = user;
    attrs.$empty = $empty;
    attrs.$key = value;
    return (
        <ColumnUser {...attrs}/>
    )
};
const jsxTable = (reference, value = [], config = {}) => {
    const {table = {}} = config;
    const tableAttrs = Ux.clone(table);
    tableAttrs.pagination = false;
    tableAttrs.className = "web-table";
    tableAttrs.columns = Ux.configColumn(reference, table.columns);
    return (
        <Table {...tableAttrs} dataSource={value}/>
    )
};
const jsxDownload = (reference, value, config = {}) => {
    const {download = {}, preview = {}} = config;
    let display;
    if (download.text) {
        display = download.text;
    } else {
        display = value;
    }

    return (
        <span>
            {/* eslint-disable-next-line */}
            <a href={""} onClick={event => {
                Ux.prevent(event);
                Ux.ajaxDownload(value).then(data => {
                    const ref = Ux.onReference(reference, 1);
                    if (ref) {
                        const value = Ux.formGet(ref, download.filename);
                        saveAs(data, value);
                    }
                })
            }}>{display}</a>
            &nbsp;&nbsp;
            {preview.empty}
        </span>
    )
}
export default {
    jsxDownload,
    /* 普通标签 */
    jsxMoment,
    jsxLabel,
    jsxItems,
    jsxRecord,
    jsxUser,
    jsxTable
}