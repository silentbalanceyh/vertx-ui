import React from 'react';
import {Button, Icon, Popconfirm, Tooltip} from 'antd';
import Ux from 'ux';

const _renderLink = (reference, config = {}) => {
    const {
        icon, text,
        onClick,
        key,
        disabled = false
    } = config;
    const attrs = {};
    attrs.disabled = disabled;
    if (Ux.isFunction(config.onClick)) {
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

const renderLink = (reference, config = {}) => {
    const {
        plugin = {},
        onClick,
        ...rest
    } = config;
    if (plugin.prompt) {
        if (rest.disabled) {
            /*
             * 禁用的时候不设置 Popconfirm
             */
            return _renderLink(reference, rest);
        } else {
            /*
             * 只有不禁用的时候使用下边这种格式
             */
            return (
                <Popconfirm title={plugin.prompt} placement={"top"} onConfirm={onClick}>
                    {_renderLink(reference, rest)}
                </Popconfirm>
            )
        }
    } else {
        return _renderLink(reference, {
            ...rest,
            onClick
        });
    }
};

const _renderButton = (reference, config = {}) => {
    /*
     * 防重复提交
     */
    const {
        $submitting = false
    } = reference.props;
    config.loading = $submitting;
    const {text, ...rest} = config;
    if (text) {
        /* 标准按钮 */
        return (<Button {...rest}>{text}</Button>);
    } else {
        /* 非标准按钮 */
        return (<Button {...rest}/>);
    }
};

const _renderPrompt = (reference, config = {}) => {
    const {plugin = {}, onClick, ...rest} = config;
    if (plugin.prompt) {
        return (
            <Popconfirm title={plugin.prompt} placement={"left"} onConfirm={onClick}>
                {_renderButton(reference, rest)}
            </Popconfirm>
        );
    } else {
        return _renderButton(reference, {onClick, ...rest})
    }
};
const _renderTooltip = (reference, config = {}) => {
    const {plugin = {}, text, ...rest} = config;
    if (plugin.tooltip) {
        return (
            <Tooltip title={text}>
                {_renderPrompt(reference, {plugin, ...rest})}
            </Tooltip>
        );
    } else {
        return _renderPrompt(reference, {plugin, text, ...rest});
    }
};
/*
 * 默认层，先分类
 * 1）LINK 直接渲染
 * 2）BUTTON 有后续效果
 */
export default (reference, config = {}) => {
    const {$category = "BUTTON"} = reference.props;
    if ("BUTTON" === $category) {
        return _renderTooltip(reference, config);
    } else {
        return renderLink(reference, config);
    }
};