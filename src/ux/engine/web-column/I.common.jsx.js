import {Divider, Icon, Popconfirm} from "antd";
import Abs from "../../abyss";
import React from "react";
import {ColumnUser} from 'web';
import {Link} from 'react-router-dom';

const jsxSpan = (attrs = {}, children) =>
    // 解决 React 无法渲染 Object的 BUG
    (<span {...attrs}>{Abs.isObject(children) ? false : children}</span>);
export default {
    /* 分割线 */
    jsxDivider: (key) => (<Divider type={"vertical"} key={key}/>),
    /* onClick 专用链接 */
    jsxLink: (item = {}) => (<a key={item.key} onClick={item.onClick}>{item.text}</a>),
    /* onConfirm 专用 */
    jsxConfirm: (item = {}) => (
        <Popconfirm key={item.key} title={item.confirm}
                    onConfirm={item.onConfirm}>
            <a>{item.text}</a>
        </Popconfirm>
    ),
    /* jsxSpan */
    jsxSpan,
    /* jsxIcon */
    jsxIcon: (attrs = {}, children, icon) => (
        <span>
            {icon ? (<Icon type={icon.icon} style={icon.iconStyle}/>) : false}
            {icon ? (<span>&nbsp;&nbsp;</span>) : false}
            {jsxSpan(attrs, children)}
        </span>
    ),
    /* jsxUser */
    jsxUser: (attrs = {}) => (<ColumnUser {...attrs}/>),
    /* jsxHyper */
    jsxHyper: (attributes = {}, children) => {
        let {reference, url, ...attrs} = attributes;
        const {$router, $app} = reference.props;
        if ($app) {
            url = `/${$app._("path")}${url}`;
        }
        if (0 < url.indexOf("?")) {
            url += `&target=${$router.path()}`
        } else {
            url += `?target=${$router.path()}`
        }
        return (
            <Link {...attrs} to={url}>{children}</Link>
        )
    }
}