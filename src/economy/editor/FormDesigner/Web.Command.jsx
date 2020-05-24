/*
 * 命令按钮基本操作
 */
import React from "react";
import {Divider, Icon, Tooltip} from 'antd';

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
                    if (tooltip) {
                        return (
                            <Tooltip title={tooltip} key={command.key}>
                                <a href={""}>
                                    <Icon type={command.icon}/>
                                </a>
                            </Tooltip>
                        )
                    } else {
                        return (
                            <a href={""} key={command.key}>
                                <Icon type={command.icon}/>
                                &nbsp;&nbsp;
                                {command.text}
                            </a>
                        )
                    }
                }
            })}
        </div>
    );
}