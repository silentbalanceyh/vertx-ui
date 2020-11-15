import {Divider, Icon, Popconfirm} from "antd";
import Abs from "../../abyss";
import React from "react";
import Unit from '../web-unit';
import {Link} from 'react-router-dom';
import T from "../../unity";

const _jsxObject = (children = {}) => {
    const keys = Object.keys(children);
    return (
        <ul className={"ux-ul"}>
            {keys.map(key => (<li key={key}>{key} = {children[key]}</li>))}
        </ul>
    );
}
const _jsxArray = (children = [], config = {}) => {
    // 计算列宽度
    const {__array = {}} = config;
    // 基础表格渲染
    let fields = [];
    if (Abs.isArray(__array.fields)) {
        fields = __array.fields;
    } else {
        children.forEach(child => {
            const keys = Object.keys(child);
            if (fields.length < keys.length) {
                fields = keys;
            }
        });
    }
    const widthMap = __array.width ? __array.width : {};
    return (
        <table className={"ux-table-nested"}>
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
            <tbody>
            {children.map((child, childIdx) => (
                <tr key={`row${childIdx}`}>
                    {fields.map(field => (
                        <td key={`${field}${childIdx}`}>{child[field]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

const jsxSpan = (attrs = {}, children, config = {}) => (
    <span {...attrs}>
            {(() => {
                if (Abs.isObject(children)) {
                    return _jsxObject(children);
                } else if (Abs.isArray(children)) {
                    return _jsxArray(children, config);
                } else return children;
            })()}
    </span>
)
const jsxIcon = (attrs = {}, children, iconData) => {
    if (iconData) {
        const {icon, iconStyle = {}} = iconData;
        const addOn = {};
        addOn.style = iconStyle;
        if (iconStyle.color) {
            addOn['data-color'] = iconStyle.color;
            addOn['data-size'] = iconStyle.fontSize;
        }
        return (
            <span>
                {Unit.aiIcon(icon, addOn)}
                &nbsp;&nbsp;
                {jsxSpan(attrs, children)}
            </span>
        )
    } else {
        return (
            <span>
                {jsxSpan(attrs, children)}
            </span>
        )
    }
};
const queryStored = (reference = {}) => {
    /* query 专用 */
    const {$query} = reference.props;
    if (Abs.isObject($query)) {
        const queryStr = T.encryptBase64(JSON.stringify($query));
        return `condition=${queryStr}`;
    } else {
        return "";
    }
};
export default {
    /* 分割线 */
    jsxDivider: (key) => (<Divider type={"vertical"} key={key}/>),
    /* onClick 专用链接 */
    jsxLink: (item = {}) => item.enabled ? (
        <a key={item.key} onClick={item.onClick}
           className={item.icon ? "ux-link-icon" : ""}>
            {item.icon ? <Icon type={item.icon}/> : false}
            {item.text}
        </a>
    ) : false,
    /* onConfirm 专用 */
    jsxConfirm: (item = {}) => item.enabled ? (
        <Popconfirm key={item.key} title={item.confirm}
                    onConfirm={item.onConfirm}>
            <a>{item.text}</a>
        </Popconfirm>
    ) : false,
    /* jsxSpan */
    jsxSpan,
    /* jsxIcon */
    jsxIcon,
    /* jsxUser */
    jsxLazy: (attrs = {}, dataMap = {}) => {
        const value = dataMap[attrs.$key];
        return jsxIcon({}, value, {icon: attrs.$icon})
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
        url += queryStored(reference);
        url += `&target=${$router.path()}`;
        return (
            <Link {...attrs} to={url}>{children}</Link>
        )
    }
}