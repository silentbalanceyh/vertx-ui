import React from 'react';
import {Table} from 'antd';
import JsonView from 'react-json-view';
import {LazyColumn} from "zi";
import {saveAs} from 'file-saver';
import __Zn from "../zero.uca.dependency.table.UNLOCK";
import {_Ant} from 'zo';

const jsxMoment = (reference, value, config = {}) => {
    // 时间信息处理
    const formatted = value.format(config.format);
    return jsxLabel(reference, formatted, config);
};
const jsxItems = (reference, value, config = {}) => {
    /*
     * 除了 value = key，可支持 value = code 模式
     */
    let keyField = "key";
    if ("string" === typeof config.datum) {
        const datum = __Zn.parseSource(config.datum);
        if (datum.value) {
            keyField = datum.value;
        }
    }
    let item = __Zn.elementUnique(config.items, keyField, value);
    if (!item) {
        item = __Zn.elementUnique(config.items, keyField, String(value));
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
const jsxDatum = (reference, value, config = {}) => {
    const options = _Ant.toOptions(reference, config);
    return jsxItems(reference, value, options);
}
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
            {__Zn.isObject(normalized.record) ? (
                <JsonView {...attrs}/>
            ) : false}
        </span>
    );
};
const jsxLabel = (reference, value, config = {}) => {
    const {smartFile = false} = config;
    let children;
    if (__Zn.isObject(value)) {
        children = __Zn.wayO2S(value);
    } else {
        if (smartFile && __Zn.isNumber(value)) {
            children = __Zn.toFileSize(value);
        } else {
            children = value;
        }
    }
    return (<span>{children}</span>);
}
const jsxIcon = (reference, icon, style = {}) => __Zn.v4Icon(icon, {style});
const jsxUser = (reference, value, config = {}) => {
    const {user = {}, $empty = ""} = config;
    const attrs = {};
    attrs.config = user;
    attrs.$empty = $empty;
    attrs.$key = value;
    return (
        <LazyColumn {...attrs}/>
    )
};
const jsxTable = (reference, value = [], config = {}) => {
    const {table = {}} = config;
    const tableAttrs = __Zn.clone(table);
    tableAttrs.pagination = false;
    tableAttrs.className = "ux_table";
    tableAttrs.scroll = {x: "max-content"};
    tableAttrs.columns = __Zn.configColumn(reference, table.columns);
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
                __Zn.prevent(event);
                __Zn.ajaxDownload(value).then(data => {
                    const ref = __Zn.onReference(reference, 1);
                    if (ref) {
                        const value = __Zn.formGet(ref, download.filename);
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
    jsxDatum,
    jsxRecord,
    jsxUser,
    jsxTable
}