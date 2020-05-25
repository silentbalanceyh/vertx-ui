/*
 * 命令按钮基本操作
 */
import React from "react";
import {Divider, Tooltip} from 'antd';
import Ux from 'ux';

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
                    const renderLink = (item = {}) => (
                        <a href={""} className={item.className ? `op-link ${item.className}` : `op-link`}>
                            {Ux.aiIcon(item.icon, {"data-color": item['svgColor'] ? item['svgColor'] : "#595959"})}
                        </a>
                    )
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