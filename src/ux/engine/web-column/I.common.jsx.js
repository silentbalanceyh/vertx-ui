import {Divider, Icon, Popconfirm} from "antd";
import Abs from "../../abyss";
import React from "react";
import Unit from '../web-unit';
import {Link} from 'react-router-dom';
import T from "../../unity";

const jsxSpan = (attrs = {}, children) =>
    // 解决 React 无法渲染 Object的 BUG
    (<span {...attrs}>{Abs.isObject(children) ? false : children}</span>);
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