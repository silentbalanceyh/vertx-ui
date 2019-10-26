import React from 'react';
import {Icon} from 'antd';
import JsonView from 'react-json-view';
import Ux from 'ux';
import U from 'underscore';

const jsxMoment = (reference, value, config = {}) => {
    // 时间信息处理
    const formatted = value.format(config.format);
    return jsxLabel(reference, formatted, config);
};
const jsxItems = (reference, value, config = {}) => {
    const item = Ux.elementUnique(config.items, "key", String(value));
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
const jsxLabel = (reference, value, config = {}) => (<span>{value}</span>);
const jsxIcon = (reference, icon, style = {}) => (<Icon type={icon} style={style}/>);
export default {
    /* 普通标签 */
    jsxMoment,
    jsxLabel,
    jsxItems,
    jsxRecord,
}