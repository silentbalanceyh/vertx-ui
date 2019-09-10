import React from 'react';
import {Button} from 'antd';
import Ut from '../../unity';

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

const aiButton = (reference, button = {}) => {
    if (!button.key) {
        button.key = Ut.randomUUID();
    }
    const {text, ...rest} = button;
    return (
        <Button {...rest}>{text}</Button>
    )
};

export default {
    aiButtonGroup,
    aiButton,
}