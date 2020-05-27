/*
 * 命令按钮基本操作
 */
import React from "react";
import {Divider, Popover, Tooltip} from 'antd';
import Ux from 'ux';
import Cmd from './command';

const isDisabled = (reference, item) => {
    const fnDisabled = Cmd.CommandDisabled[item.key];
    if (Ux.isFunction(fnDisabled)) {
        return fnDisabled(reference);
    } else return false;
}

const renderPopover = (reference, item = {}, children) => {
    const {$popover} = reference.state;
    const visible = $popover ? $popover === item.key : false;
    const fnContent = Cmd.CommandPop[item.key];
    const popoverStyle = Cmd.CommandPopStyle[item.key];
    return (
        <Popover visible={visible} trigger={"click"}
                 overlayClassName={"web-form-designer-popover"}
                 overlayStyle={popoverStyle ? popoverStyle : {}}
                 content={Ux.isFunction(fnContent) ? fnContent(reference) : false}
                 placement={"bottomLeft"}>
            {children}
        </Popover>
    )
}
const renderLink = (reference, item) => renderPopover(reference, item, (() => {
    const attrs = {};
    attrs['aria-disabled'] = isDisabled(reference, item);
    if (!attrs['aria-disabled']) {
        attrs.onClick = (event) => {
            Ux.prevent(event);
            const executor = Cmd.CommandAction[item.key];
            if (Ux.isFunction(executor)) {
                executor(reference, item);
            } else {
                console.error("丢失命令：", item);
            }
        }
    } else {
        attrs.onClick = (event) => {
            Ux.prevent(event);
        }
    }
    attrs.className = item.className ? `op-link ${item.className}` : `op-link`;
    if (attrs['aria-disabled']) {
        attrs.className = `${attrs.className} op-disabled`
    }
    return (
        <a href={""} {...attrs}>
            {Ux.aiIcon(item.icon, {
                "data-color": attrs.disabled ? "#ececec" : (item['svgColor'] ? item['svgColor'] : "#595959")
            })}
        </a>
    )
})());

export default (reference) => {
    const {$commands = []} = reference.state;
    return (
        <div className={"designer-tool"}>
            {$commands.map((command, index) => {
                if ("divider" === command) {
                    return (
                        <Divider type={"vertical"} key={`divider${index}`}/>
                    );
                } else {
                    const tooltip = command.tooltip;
                    if (tooltip) {
                        const disabled = isDisabled(reference, command);
                        return disabled ? renderLink(reference, command) : (
                            <Tooltip title={tooltip} key={command.key}>
                                {renderLink(reference, command)}
                            </Tooltip>
                        )
                    } else {
                        return renderLink(reference, command);
                    }
                }
            })}
        </div>
    );
}