import Abs from '../../abyss';
import Expr from '../expression';
import {Icon, Popconfirm, Tooltip} from "antd";
import React from 'react';

const opLink = (config = {}, action) => {
    const {confirm, confirmPosition, ...rest} = config;
    const fnLnk = (linkConfig = {}) => {
        const {
            tooltip, text, icon,
            ...other
        } = linkConfig;
        if (tooltip) {
            return (
                <Tooltip key={linkConfig.key} title={text}>
                    <a href={""} {...other}>
                        {<Icon type={icon}/>}
                    </a>
                </Tooltip>
            )
        } else {
            const {
                text, icon,
                ...other
            } = linkConfig;
            return (
                <a href={""} {...other}>
                    {icon ? <Icon type={icon}/> : false}
                    {text}
                </a>
            )
        }
    }
    if (confirm && !rest.disabled) {
        // 带 confirm
        const confirmAttrs = {};
        confirmAttrs.title = confirm;
        if (confirmPosition) {
            confirmAttrs.placement = confirmPosition
        }
        if (!rest.disabled) {
            confirmAttrs.onConfirm = action;
        }
        return (
            <Popconfirm key={config.key} {...confirmAttrs}>
                {fnLnk(rest)}
            </Popconfirm>
        )
    } else {
        // 不带 confirm
        const $rest = Abs.clone(rest);
        if (!rest.disabled) {
            $rest.onClick = action;
        }
        return fnLnk($rest);
    }
}
const opExtra = (config = [], actions = {}, status = {}) => {
    if (Abs.isArray(config)) {
        const normalized = Expr.aiExprCommands(config);
        return normalized.map(item => {
            let onClick = (event) => {
                Abs.prevent(event);
                console.error("对不起，未绑定 onClick 函数", item.key);
            };
            const executor = actions[item.key];
            if (Abs.isFunction(executor)) {
                onClick = (event) => {
                    Abs.prevent(event);
                    executor(event, item);
                }
            }
            const {disabled = false} = status;
            const $item = Abs.clone(item);
            $item.disabled = disabled;
            // 根据状态处理
            return opLink($item, onClick);
        });
    } else return false; // 什么都不渲染
}
export default {
    opExtra,
    opLink,
}