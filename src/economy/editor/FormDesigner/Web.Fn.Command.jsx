/*
 * 命令按钮基本操作
 */
import React from "react";
import {Divider, Popover, Tooltip} from 'antd';
import Ux from 'ux';
import Op from './op';
import renderPop from './Web.O.Popover';

const renderPopover = (reference, item = {}, children) => {
    const {$popover} = reference.state;
    const visible = $popover ? $popover === item.key : false;
    const fnContent = renderPop[item.key];
    return (
        <Popover visible={visible} trigger={"click"}
                 overlayClassName={"web-form-designer-popover"}
                 content={Ux.isFunction(fnContent) ? fnContent(reference) : false}
                 placement={"bottomLeft"}>
            {children}
        </Popover>
    )
}

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
                    /* 不带文字 */
                    const renderLink = (item = {}) => renderPopover(reference, item, (
                        <a href={""} className={item.className ? `op-link ${item.className}` : `op-link`}
                           onClick={event => {
                               Ux.prevent(event);
                               const executor = Op.Command[item.key];
                               if (Ux.isFunction(executor)) {
                                   executor(reference, item);
                               } else {
                                   console.error("丢失命令：", item);
                               }
                           }}>
                            {Ux.aiIcon(item.icon, {"data-color": item['svgColor'] ? item['svgColor'] : "#595959"})}
                        </a>
                    ))
                    if (tooltip) {
                        return (
                            <Tooltip title={tooltip} key={command.key}>
                                {renderLink(command)}
                            </Tooltip>
                        )
                    } else {
                        return renderLink(command);
                    }
                }
            })}
        </div>
    );
}