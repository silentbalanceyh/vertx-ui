import React from 'react';
import {Button, Popconfirm, Tooltip} from 'antd';
import renderLink from './Web.Link';

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