// Expr
import Expr from "../expression";
import Abs from '../../abyss';
import Ele from '../../element';
// Xt
import U from "underscore";
import React from "react";
// 不同分流器
import On from './I.render.on';
import Out from './I.render.out';
import {Icon} from "antd";

const jsxChild = (column = {}, record = {}, fnRender) => {
    // config中是否配置了childOnly
    const {$config = {}} = column;
    if ($config['childOnly']) {
        // 如果是childOnly则只有children = [] > 0 时渲染
        if (record.children && 0 < record.children.length) {
            return false;
        } else return U.isFunction(fnRender) ? fnRender() : false;
    } else return U.isFunction(fnRender) ? fnRender() : false;
};
const jsxConnect = (fnStatic, fnDynamic, fnRender) => {
    if (!fnDynamic) {
        // 默认的行为实现
        fnDynamic = (attrs = {}, reference, params = {}, channel = {}) => {
            Out.outReadOnly(attrs, reference, params); // readOnly属性
            if (U.isFunction(channel.fnChange)) {
                attrs.onChange = channel.fnChange(params.index);  // 变更函数
            }
            attrs.value = params.text;  // 设值处理
        };
    }
    return (reference, column = {}, jsx) => {
        // 穿透引用
        const channel = {};
        // 执行静态处理函数
        const attrs = fnStatic(reference, {column, jsx}, channel);

        return (text, record = {}, index) => jsxChild(column, record, () => {
            // 执行动态处理函数
            fnDynamic(attrs, reference, {jsx, column, text, record, index}, channel);
            // 执行渲染专用函数
            const {children, ...rest} = attrs;
            return fnRender(rest, children);
        });
    };
};
const jsxIcon = (item = {}) => {
    if (item.hasOwnProperty("style") && !item.hasOwnProperty("iconStyle")) {
        item.iconStyle = item.style;
        if (item.iconStyle.hasOwnProperty("fontSize")) {
            item.iconStyle.fontSize = Ele.valueInt(item.iconStyle.fontSize);
        }
    }
    // 文字信息
    let text = item.text || item.label;
    if (!text) text = "";
    return (
        <span>
            {item.icon ? (<Icon type={item.icon} style={item.iconStyle}/>) : false}
            {item.icon ? (<span>&nbsp;&nbsp;</span>) : false}
            <span className={"zero-icon-text"}>{text}</span>
        </span>
    );
};
export default {
    // ------- 静态
    ...On,
    // ------- 动态
    ...Out,
    // ------- 初始化
    initEmpty: () => (Abs.clone({})),
    initDynamic: (params = {}) => Expr.applyDynamic(params.column),
    initConfig: () => (params = {}) => params.column["$config"] ? params.column["$config"] : {},
    // ------- jsx渲染流程变化
    jsxConnect,
    jsxSpan: (attrs = {}, children) => (<span {...attrs}>{children}</span>),
    jsxIcon,
};