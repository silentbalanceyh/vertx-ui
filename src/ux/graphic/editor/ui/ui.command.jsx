import {Command} from 'editor';
import {Divider, Icon, Progress, Tooltip} from 'antd';
import React from 'react';
import Ux from 'ux';

export default (reference) => {
    const {
        $submitting = false,
        $event = {}
    } = reference.props;
    /* 命令工具专用配置 */
    const configCommands = $event.configCommands();
    return $submitting ? (
        <Progress status={"active"} percent={33}/>
    ) : configCommands.map(item => {
        if ('|' === item) {
            return (
                <Divider key={Ux.randomUUID()} type="vertical" className={"divider"}/>
            )
        } else {
            const {text, icon, command} = item;
            return (
                <Command key={command} name={command} className={"command"}
                         disabledClassName={"command-disabled"}>
                    <Tooltip title={text}>
                        <Icon type={icon} style={{fontSize: 20}}/>
                    </Tooltip>
                </Command>
            )
        }
    })
}