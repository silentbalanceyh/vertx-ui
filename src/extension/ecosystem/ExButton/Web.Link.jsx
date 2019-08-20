import {Icon, Popconfirm} from "antd";
import React from "react";
import U from 'underscore';

const _renderLink = (reference, config = {}) => {
    const {
        icon, text,
        onClick,
        key,
        disabled = false
    } = config;
    const attrs = {};
    attrs.disabled = disabled;
    if (U.isFunction(config.onClick)) {
        attrs.onClick = onClick;
    }
    return (
        <li key={`link-batch-${key}`}>
            <a {...attrs}>
                {icon ? <Icon type={icon}/> : false}
                {icon ? <span>&nbsp;&nbsp;</span> : false}
                {text ? <span className={"text"}>{text}</span> : false}
            </a>
        </li>
    )
};

export default (reference, config = {}) => {
    const {
        plugin = {},
        onClick,
        ...rest
    } = config;
    if (plugin.prompt) {
        return (
            <Popconfirm title={plugin.prompt} placement={"top"} onConfirm={onClick}>
                {_renderLink(reference, rest)}
            </Popconfirm>
        )
    } else {
        return _renderLink(reference, {
            ...rest,
            onClick
        });
    }
};