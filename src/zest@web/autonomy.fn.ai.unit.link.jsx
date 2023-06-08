import React from 'react';
import {Button, Popconfirm, Tooltip} from "antd";

import {Link} from "react-router-dom";

import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const aiUrl = (item = {}, addOn = {}) => {
    const {$router} = addOn;
    let baseUri;
    if ("$MAIN$" === item.uri) {
        baseUri = Cv.ENTRY_ADMIN
    } else if ("$SELF$" === item.uri) {
        baseUri = $router ? $router.uri() : "";
    } else {
        let uri;
        if (item.uri.startsWith("/")) {
            uri = item.uri;
        } else {
            uri = "/" + item.uri;
        }
        if (!uri.startsWith(`/${Cv['ROUTE']}/`)) {
            uri = `/${Cv['ROUTE']}${uri}`
        }
        baseUri = $router ? $router.uri(uri) : uri;
    }
    /*
     * pid / mid
     */
    if (!baseUri.endsWith("?")) {
        baseUri += "?";
    }
    const parameters = [];
    const mid = __Zn.toQuery(Cv.K_ARG.MID);
    if (mid) {
        parameters.push(`mid=${mid}`);
    }
    const pid = __Zn.toQuery(Cv.K_ARG.PID);
    if (pid) {
        parameters.push(`pid=${pid}`);
    }
    if (0 < parameters.length) {
        baseUri += parameters.join("&");
    }
    return baseUri;
};

const aiLink = (item = {}, addOn = {}) => {
    if (item.uri && Cv.VALUE.MENU_EXPAND !== item.uri) {
        if (item.disabled) {
            return (
                <span className={`ux-disabled ${item.className ? item.className : ""}`}>
                    {item.text}
                </span>
            )
        } else {
            if (__Zn.isFunction(item.__uri)) {
                return (
                    // eslint-disable-next-line
                    <a href={""} onClick={item.__uri} className={item.className ? item.className : ""}>
                        {item.text}
                    </a>
                )
            } else {
                return (
                    <Link className={item.className ? item.className : ""} to={aiUrl(item, addOn)}>
                        {item.text}
                    </Link>
                )
            }
        }
    } else return (<span>{item.text}</span>);
};

const __aiAnchor = (item = {}, onClick, defaultType = "BUTTON") => {
    const {text, category = defaultType, ...rest} = item;
    if (onClick) rest.onClick = onClick
    if ("BUTTON" === category) {

        if (text) {
            // 有文字按钮
            return (
                <Button {...rest}>{text}</Button>
            )
        } else {
            // 无文字按钮
            return (
                <Button {...rest}/>
            )
        }
    } else {
        // 链接执行
        return (
            // eslint-disable-next-line
            <a href={""} key={rest.key} onClick={rest.onClick}>{text}</a>
        )
    }
}
const aiAnchor = (item = {}, onClick, defaultType = "BUTTON") => {
    if (__Zn.isFunction(onClick)) {
        const fnClick = event => {
            __Zn.prevent(event);
            onClick(event);
        }
        const {confirm, category, ...rest} = item;
        let addOn = {};
        if (confirm) {
            addOn = __Zn.clone(rest);
            addOn.category = category ? category : defaultType;
            return (
                <Popconfirm title={confirm} onConfirm={fnClick} key={item.key}>
                    {__aiAnchor(addOn, null)}
                </Popconfirm>
            )
        } else {
            addOn = __Zn.clone(item);
            addOn.category = category ? category : defaultType;
            return __aiAnchor(addOn, fnClick);
        }
    } else {
        console.log(`对不起，传入的\`onClick\`不合法，不渲染任何内容。`, item);
        return false;
    }
}

const aiLinkMore = (config = {}, reference) => {
    if (config.icon && config.text) {
        return (
            <Tooltip title={config.text}>
                <Button icon={__Zn.v4Icon(config.icon)} shape={"circle"}
                        size={"small"}
                        onClick={(event) => {
                            event.preventDefault();
                            __Zn.toRoute(reference, config.uri);
                        }}/>
            </Tooltip>
        );
    } else return false;
};
const aiLinkBack = (reference, attrs = {}) => {
    return (
        <Button shape={"circle"} className={"uc_red"} icon={__Zn.v4Icon("close")}
                onClick={event => {
                    __Zn.prevent(event);
                    __Zn.toOriginal(reference);
                }}
        />
    );
};
export default {
    aiUrl,              // 路由表地址解析
    aiAnchor,           // 连接 / 按钮 双执行处理
    aiLink,             // 链接解析
    aiLinkMore,         // （按钮）<Button/>
    aiLinkBack,         // （按钮）<Button/>
}