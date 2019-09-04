import React from 'react';
import {Button} from 'antd';
import U from 'underscore';

const _jsxUniform = (jsx = {}, fnRender) => {
    const {grouped = false} = jsx;
    if (grouped) {
        return (
            <Button.Group>
                {U.isFunction(fnRender) ? fnRender() : false}
            </Button.Group>
        )
    } else {
        return (
            <span>
                {U.isFunction(fnRender) ? fnRender({
                    style: {
                        marginRight: 8
                    }
                }) : false}
            </span>
        )
    }
};
const aiAction = (reference, jsx = {}) =>
    _jsxUniform(jsx, (config = {}) => {
        const {actions = [], loading = false} = jsx;
        return actions.map(item => {
            const {text, ...reset} = item;
            reset.loading = loading;
            return (
                <Button {...reset} style={config.style}>{text}</Button>
            );
        })
    });
const ai2Action = (onChange) => (reference, jsx = {}) => {

};
export default {
    aiAction,
    ai2Action,
}