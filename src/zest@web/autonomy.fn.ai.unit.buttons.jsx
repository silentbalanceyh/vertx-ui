import __Zn from './zero.module.dependency';
import {Button} from "antd";
import React from 'react';

const aiButton = (reference, button = {}) => {
    if (!button.key) {
        button.key = __Zn.randomUUID();
    }
    const {text, ...rest} = button;
    if (rest.icon) {
        rest.icon = __Zn.v4Icon(rest.icon);
    }
    return (
        <Button {...rest}>{text}</Button>
    )
};
const aiButtonGroup = (reference, buttons = []) => {
    if (1 === buttons.length) {
        const button = buttons[0];
        return aiButton(reference, button);
    } else {
        return (
            <Button.Group>
                {buttons.map(button => aiButton(reference, button))}
            </Button.Group>
        )
    }
};
export default {
    aiButton,
    aiButtonGroup,
}