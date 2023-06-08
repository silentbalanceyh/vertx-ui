import React from "react";
import {ExclamationCircleFilled} from '@ant-design/icons';
import {Divider, Popconfirm} from "antd";
import {Link} from "react-router-dom";
import __Zn from './zero.uca.dependency';

import __AI_ELE from '../autonomy.fn.ai.unit.element';

const WebUnit = {
    ...__AI_ELE,
}

const __queryStored = (reference = {}) => {
    /* query 专用 */
    const {$query} = reference.props;
    if (__Zn.isObject($query)) {
        const queryStr = __Zn.encryptBase64(__Zn.wayO2S($query));
        return `condition=${queryStr}`;
    } else {
        return "";
    }
};

const __jsxObject = (children = {}) => {
    const keys = Object.keys(children);
    return (
        <ul className={"ux-ul"}>
            {keys.map(key => (<li key={key}>{key} = {children[key]}</li>))}
        </ul>
    );
}

const __jsxArray = (children = [], config = {}) => {
    // 计算列宽度
    const {__array = {}} = config;
    // 基础表格渲染
    let fields = [];
    if (__Zn.isArray(__array.fields)) {
        fields = __array.fields;
    } else {
        children.forEach(child => {
            const keys = Object.keys(child);
            if (fields.length < keys.length) {
                fields = keys;
            }
        });
    }
    // 修改 Array 类型的呈现
    const widthMap = __array.width ? __array.width : {};
    const isPure = 0 === fields.length;
    return (
        <table className={`${isPure ? "ux-table-nested-pure" : "ux-table-nested"}`}>
            {0 < fields.length ? (
                <thead>
                <tr>
                    {fields.map(field => {
                        const style = {};
                        if (widthMap.hasOwnProperty(field)) {
                            // 各自16的边距
                            style.width = widthMap[field];
                        }
                        return (
                            <th key={field} style={style}>{field}</th>
                        )
                    })}
                </tr>
                </thead>
            ) : false}
            <tbody>
            {children.map((child, childIdx) => (
                <tr key={`row${childIdx}`}>
                    {isPure ? (
                        <td key={`${childIdx}`}>{child}</td>
                    ) : (fields.map(field => (
                        <td key={`${field}${childIdx}`}>{child[field]}</td>
                    )))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
const __jsxSpan = (attrs = {}, children, config = {}) => {
    const {jsxIcon} = config;
    return (
        <span {...attrs}>
            {(() => {
                if (__Zn.isObject(children)) {
                    return __jsxObject(children);
                } else if (__Zn.isArray(children)) {
                    return __jsxArray(children, config);
                } else return children;
            })()}
            {__Zn.isFunction(jsxIcon) ? jsxIcon() : false}
        </span>
    )
}
const __jsxIcon = (attrs = {}, children, iconData) => {
    if (iconData) {
        const {icon, iconStyle = {}} = iconData;
        const addOn = {};
        addOn.style = iconStyle;
        if (iconStyle.color) {
            addOn['data-color'] = iconStyle.color;
            addOn['data-size'] = iconStyle.fontSize;
        }
        const style = {};
        if (32 < iconStyle.fontSize) {
            style.lineHeight = `${iconStyle.fontSize}px`
        }
        return (
            <span className={"ux_icon_label"}>
                {WebUnit.aiIcon(icon, addOn)}
                {__jsxSpan({
                    ...attrs,
                    className: "label",
                    style
                }, children)}
            </span>
        )
    } else {
        return (
            <span>
                {__jsxSpan(attrs, children)}
            </span>
        )
    }
};

export default {
    /* 分割线 */
    jsxDivider: (key) => (<Divider type={"vertical"} key={key}/>),
    /* onClick 专用链接 */
    jsxLink: (item = {}) => item.enabled ? (
        // eslint-disable-next-line
        <a key={item.key} onClick={item.onClick}
           className={item.icon ? "ux-link-icon" : ""}>
            {item.icon ? __Zn.v4Icon(item.icon) : false}
            {item.text}
        </a>
    ) : false,
    /* onConfirm 专用 */
    jsxConfirm: (item = {}) => item.enabled ? (
        <Popconfirm key={item.key} title={item.confirm}
                    overlayClassName={"ux-confirm-op"}
                    icon={<ExclamationCircleFilled/>}
                    onConfirm={item.onConfirm}>
            {/* eslint-disable-next-line*/}
            <a>{item.text}</a>
        </Popconfirm>
    ) : false,
    /* */
    /* jsxSpan */
    jsxSpan: __jsxSpan,
    /* jsxIcon */
    jsxIcon: __jsxIcon,
    /* jsxUser */
    jsxLazy: (attrs = {}, dataMap = {}) => {
        const value = dataMap[attrs.$key];
        return __jsxIcon({}, value, {icon: attrs.$icon})
    },
    /* jsxHyper */
    jsxHyper: (attributes = {}, children) => {
        let {reference, url, ...attrs} = attributes;
        const {$router, $app} = reference.props;
        if ($app) {
            url = `/${$app._("path")}${url}`;
        }
        if (0 < url.indexOf("?")) {
            url += `&`
        } else {
            url += `?`
        }
        url += __queryStored(reference);
        url += `&target=${$router.path()}`;
        return (
            <Link {...attrs} to={url}>{children}</Link>
        )
    }
}