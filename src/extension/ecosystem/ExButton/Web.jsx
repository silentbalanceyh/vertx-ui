import React from 'react';
import {Button, Icon, Popconfirm, Radio, Select, Tooltip} from 'antd';
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

const renderLink = (reference, configuration = {}) => {
    const {
        plugin = {},
        onClick,
        ...rest
    } = configuration;
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
                <Popconfirm title={plugin.prompt} placement={"top"}
                            overlayClassName={"ux-confirm-op"}
                            onConfirm={onClick}>
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
    const {text, visible = true, ...rest} = config;
    if (!visible) {
        // Fix Bug: Received `true` for a non-boolean attribute `visible`.
        return false;
    }
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
const renderButton = (reference, configuration = {}) => {
    const {plugin = {}, text, ...rest} = configuration;
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
const renderDefined = (reference, configuration) => {
    const {component, config = {}, onClick} = configuration;
    const {items = [], executor, ...rest} = config;
    const options = [];
    items.forEach(item => {
        const kv = item.split(',');
        options.push({
            value: kv[0],
            label: kv[1]
        })
    })
    if ("RADIO" === component) {
        return (
            <Radio.Group style={{
                marginTop: 4
            }} options={options} {...rest} onChange={event => {
                const value = event.target.value;
                if (Ux.isFunction(onClick)) {
                    onClick(value);
                }
            }}/>
        )
    } else if ("SELECT" === component) {
        return (
            <Select style={{width: "120px"}} {...rest} onChange={value => {
                if (Ux.isFunction(onClick)) {
                    onClick(value);
                }
            }}>
                {options.map(item => (
                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>))}
            </Select>
        )
    } else {
        return false;
    }
}
export default {
    renderButton,
    renderLink,
    renderDefined
}