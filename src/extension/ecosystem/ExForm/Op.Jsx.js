import React from 'react';
import {Button} from 'antd';

const _jsxSingle = (event = {}) => {
    const {text, ...rest} = event;
    return (<Button {...rest}>{text}</Button>)
};

export default (events = []) => {
    if (0 === events.length) {
        /* 无按钮配置 */
        return false;
    } else if (1 === events.length) {
        return _jsxSingle(events[0])
    } else {
        return (
            <Button.Group>
                {events.map(event => _jsxSingle(event))}
            </Button.Group>
        )
    }
}
