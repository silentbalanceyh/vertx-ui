import React from 'react'
import Ux from 'ux';
import './Cab.less'
import Op from './Op'
import {Button, Tooltip} from 'antd';
import Immutable from 'immutable';

const getTool = (reference, ...keys) => {
    const buttons = [];
    let finalKeys = [];
    if (0 === keys.length) {
        finalKeys = Object.keys(Op.Tool);
    } else {
        finalKeys = keys;
    }
    const toolbar = Ux.fromHoc(reference, "toolbar");
    const isContain = (key) => {
        const {$tool = []} = reference.props;
        return Immutable.fromJS($tool).contains(key);
    };
    finalKeys.forEach(key => {
        const button = {};
        button.key = Ux.randomUUID();
        const literal = toolbar[key];
        const array = literal.split(',');
        button.tip = array[0];
        button.onClick = Op.Tool[key](reference);
        button.icon = key;
        button.className = array[1] ? array[1] : "";
        button.type = array[2] ? array[2] : "default";
        button.disabled = isContain(key);
        buttons.push(button);
    });
    return buttons;
};

class Component extends React.PureComponent {

    render() {
        const {reference} = this.props;
        const tools = getTool(reference);
        return (
            <Button.Group className={"web-toolbar"}>
                {tools.map(tool => {
                    const {tip, ...button} = tool;
                    return (
                        <Tooltip title={tip} key={button.key}>
                            <Button {...button}/>
                        </Tooltip>
                    )
                })}
            </Button.Group>
        )
    }
}

export default Component