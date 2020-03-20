import {Command} from 'editor';
import {Divider, Icon, Progress, Tooltip} from 'antd';
import React from 'react';
import Ux from 'ux';

const FLOW_COMMAND_LIST = [
    "save",
    '|',
    "undo",
    "redo",
];

export default (reference) => {
    const {config = {}, submitting} = reference.props;
    const {commandLabel = {}} = config;
    return submitting ? (
        <Progress status={"active"} percent={33}/>
    ) : FLOW_COMMAND_LIST.map(name => {
        if (name === '|') {
            return <Divider key={Ux.randomUUID()}
                            type="vertical"
                            className={"divider"}/>;
        }
        return (
            <Command key={name} name={name} className={"command"}
                     disabledClassName={"command-disabled"}>
                <Tooltip title={commandLabel[name]}>
                    <Icon type={name} style={{
                        fontSize: 20
                    }}/>
                </Tooltip>
            </Command>
        );
    })
}