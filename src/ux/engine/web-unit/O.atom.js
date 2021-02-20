import {Button, Empty, Icon, Popconfirm} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import Cv from '../../constant';
import U from "underscore";
import Ele from '../../element';
import './Cab.less';
import Abs from '../../abyss';
import aiIcon from './O.fn.icon';
import T from '../../unity';
/*
 * 基本输入
 * {
 *     uri: 路径信息
 * }
 * 1）uri = "$MAIN$" 时，环境变量中的 ENTRY_ADMIN（管理主页）
 * 2）uri = "$SELF$" 时，通过 $router 抓取的当前页
 * 3）uri = "/xxx" 时，直接为 $router.uri(xxx) 的调用结果
 */
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
    const mid = T.toQuery("mid");
    if (mid) {
        parameters.push(`mid=${mid}`);
    }
    const pid = T.toQuery("pid");
    if (mid) {
        parameters.push(`pid=${pid}`);
    }
    if (0 < parameters.length) {
        baseUri += parameters.join("&");
    }
    return baseUri;
};
/*
 * 基本输入
 * {
 *     uri: 路径信息
 *     text: 基本链接文本信息
 * }
 */
const aiLink = (item = {}, addOn = {}) => {
    if (item.uri && "EXPAND" !== item.uri) {
        if (item.disabled) {
            return (
                <span className={`ux-disabled ${item.className ? item.className : ""}`}>
                {item.text}
                </span>
            )
        } else {
            if (Abs.isFunction(item.__uri)) {
                return (
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

const aiTitle = (item = {}, addOn = {}) => (
    <span className={item.className}>
        {aiIcon(item.icon, addOn)}
        {aiLink(item, addOn)}
    </span>
);
const aiCell = (Element, attrs = {}, text) => {
    if (text && U.isObject(text)) {
        // 是否包含了colSpan和className
        const obj = {props: {}};
        if (text.hasOwnProperty('colSpan')) {
            obj.props.colSpan = text.colSpan;
        }
        // 等于0的时候直接就不计算了
        if (0 < obj.props.colSpan) {
            const {className = "", value} = text;
            obj.children = (
                <span className={className}>
                    <Element {...attrs} value={value}/>
                </span>
            );
        }
        return obj;
    } else {
        // 纯渲染
        attrs.value = text;
    }
    return (<Element {...attrs}/>);
};
/*
 * 上边图标下边文字
 */
const aiBlock = (icon, text, key) => {
    const attrs = {};
    // Fix unique key issue
    if (key) {
        attrs.dl = `dl${key}`;
        attrs.dt = `dt${key}`;
        attrs.dd = `dd${key}`;
    }
    const iconAttrs = {};
    if (0 < icon.indexOf(":")) {
        const kv = icon.split(":");
        iconAttrs.type = kv[0];
        const style = {};
        if (kv[1]) {
            style.color = kv[1];
        }
        if (kv[2]) {
            style.fontSize = Ele.valueInt(kv[2]);
        }
        if (!style.fontSize) style.fontSize = 24;
        iconAttrs.style = style;
        if (kv[3]) {
            iconAttrs.theme = kv[3];
        }
        /*
         * 修正信息
         */
        if ("twoTone" === iconAttrs.theme) {
            iconAttrs.twoToneColor = style.color;
            delete iconAttrs.style.color;
        }
    } else {
        iconAttrs.type = icon;
        iconAttrs.style = {
            fontSize: 24
        }
    }
    return (
        <dl key={attrs.dl} className={"ex-block"}>
            <dt key={attrs.dt}>
                <Icon {...iconAttrs}/>
            </dt>
            <dd key={attrs.dd}>
                {text}
            </dd>
        </dl>
    )
};
const aiEmpty = (size = 30) => (
    <div style={{paddingTop: size, paddingBottom: size}}>
        <Empty/>
    </div>
);
/*
 * 按钮连接的双执行处理，并且携带 confirm 配置
 * 1. 带有 confirm，则执行 Popconfirm 处理，onClick = onConfirm
 * 2. 不带有 confirm，则执行不带 Popconfirm 的，onClick 就是本身函数
 */
const _aiAnchor = (item = {}, onClick, defaultType = "BUTTON") => {
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
            <a href={""} key={rest.key} onClick={rest.onClick}>{text}</a>
        )
    }
}
const aiAnchor = (item = {}, onClick, defaultType = "BUTTON") => {
    if (Abs.isFunction(onClick)) {
        const fnClick = event => {
            Abs.prevent(event);
            onClick(event);
        }
        const {confirm, category, ...rest} = item;
        let addOn = {};
        if (confirm) {
            addOn = Abs.clone(rest);
            addOn.category = category ? category : defaultType;
            return (
                <Popconfirm title={confirm} onConfirm={fnClick} key={item.key}>
                    {_aiAnchor(addOn, null)}
                </Popconfirm>
            )
        } else {
            addOn = Abs.clone(item);
            addOn.category = category ? category : defaultType;
            return _aiAnchor(addOn, fnClick);
        }
    } else {
        console.log(`对不起，传入的\`onClick\`不合法，不渲染任何内容。`, item);
        return false;
    }
}
export default {
    aiIcon,     // 图标解析
    aiUrl,      // 路由表地址解析
    aiLink,     // 链接解析
    aiTitle,    // 标题解析
    aiCell,     // 单元格解析
    aiBlock,    // 上边文字 / 下边图标
    aiEmpty,    // 空处理
    aiAnchor,   // 连接 / 按钮 双执行处理
}