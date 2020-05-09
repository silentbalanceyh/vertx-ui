import React from 'react';
import {Button} from 'antd';
import U from 'underscore';
import A from '../action';

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
            const {text, ...rest} = item;
            rest.loading = loading;
            /*
             * 禁用处理
             */
            if (!rest.hasOwnProperty('disabled')) {
                const {disabled = false} = jsx;
                rest.disabled = disabled;
            }
            return (
                <Button {...rest} style={config.style}>{text}</Button>
            );
        })
    });
const aiSubmit = (reference, optionJsx = {}) => {
    const cell = {optionJsx};
    A.raftAction(cell, reference);
    const {actions = []} = optionJsx;
    if (1 === actions.length) {
        const {$loading = false} = reference.state;
        const action = actions[0];
        const {text, ...rest} = action;
        rest.loading = $loading;
        return (
            <Button {...rest}>{text}</Button>
        )
    } else {
        throw new Error("aiSubmit必须配置单独的SUBMIT操作！");
    }
}
export default {
    aiAction,
    aiSubmit,
}