/*
 * 命令按钮基本操作
 */
import React from "react";
import {Divider, Popconfirm, Tooltip} from 'antd';
import Cmd from '../command';
import renderContent from './web.cmd.popover';
import renderDialog from "./web.cmd.dialog";
import __Zn from '../zero.uca.dependency';

const isDisabled = (reference, item, config) => {
    const fnDisabled = Cmd.CommandDisabled[item.key];
    if (__Zn.isFunction(fnDisabled)) {
        return fnDisabled(reference, item, config);
    } else return false;
}
const isVisible = (reference, item, config) => {
    const fnVisible = Cmd.CommandVisible[item.key];
    if (__Zn.isFunction(fnVisible)) {
        return fnVisible(reference, item, config);
    } else return true;
}

const renderIcon = (attrs, item) => (
    // eslint-disable-next-line
    <a href={""} {...attrs} key={item.key}>
        {__Zn.aiIcon(item.icon, {
            "data-color": attrs.disabled ? "#ececec" : (item['svgColor'] ? item['svgColor'] : "#595959")
        })}
    </a>
)
const renderLink = (reference, item, config) => renderContent(reference, {
    item, config,
}, (() => {
    const visible = isVisible(reference, item, config);
    if (visible) {
        const attrs = {};
        attrs.key = item.key;
        attrs['aria-disabled'] = isDisabled(reference, item, config);
        if (!attrs['aria-disabled']) {
            attrs.onClick = (event) => {
                __Zn.prevent(event);
                const executor = Cmd.CommandAction[item.key];
                if (__Zn.isFunction(executor)) {
                    executor(reference, item, config);
                } else {
                    console.error("丢失命令：", item);
                }
            }
        } else {
            attrs.onClick = (event) => {
                __Zn.prevent(event);
            }
        }
        attrs.className = item.className ? `op-link ${item.className}` : `op-link`;
        if (attrs['aria-disabled']) {
            attrs.className = `${attrs.className} op-disabled`
        }
        /* 渲染 */
        if (item.confirm && !attrs['aria-disabled']) {
            const {onClick, ...lefts} = attrs;
            return (
                <Popconfirm key={item.key} title={item.confirm} onConfirm={onClick}>
                    {renderIcon(lefts, item)}
                </Popconfirm>
            )
        } else {
            return renderIcon(attrs, item);
        }
    } else return false;
})());

const renderCmd = (reference, command, config = {}) => {
    // 设置 item
    const tooltip = command.tooltip;
    const {placement = "top"} = config;
    if (tooltip) {
        // const disabled = isDisabled(reference, command);
        return (
            <Tooltip title={tooltip} key={command.key}
                     placement={placement}>
                {renderLink(reference, command, config)}
            </Tooltip>
        )
    } else {
        return renderLink(reference, command, config);
    }
}
const _renderCmds = (reference, commands = [], config = {}) => {
    const {className = "designer-tool", commandStyle = {}} = config;
    return (
        <div className={className} style={commandStyle}>
            {commands.map((command, index) => {
                if ("divider" === command) {
                    return (
                        <Divider type={"vertical"} key={`divider${index}`}/>
                    );
                } else return renderCmd(reference, command, config);
            })}
            {commands.map((command) => renderDialog(reference, command))}
        </div>
    );
}

function renderCmds() {
    if (3 === arguments.length) {
        const reference = arguments[0];
        const commands = arguments[1];
        const config = arguments[2];
        return _renderCmds(reference, commands, config);
    } else {
        const reference = arguments[0];
        const config = arguments[1];
        const {$commands = []} = reference.state;
        return _renderCmds(reference, $commands, config);
    }
}

export default {
    renderCmd,
    renderCmds,
}