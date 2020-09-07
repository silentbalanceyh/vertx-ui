import Abs from '../../abyss';
import React from 'react';
import {Button} from "antd";
/*
 * PageCard 中的 left 专用
 * config: [] 数组按钮
 */
const aiOpLeft = (reference, buttons = [], disabled = {}) => {
    return (
        <Button.Group>
            {buttons.map(button => {
                const $item = Abs.clone(button);
                /*
                 * Redux 专用处理
                 */
                const {$submitting} = reference.props;
                if ($submitting && $submitting.is()) {
                    const submitting = $submitting.to();
                    $item.loading = submitting.loading;
                } else {
                    if ("boolean" === typeof $submitting) {
                        $item.loading = $submitting;
                    }
                }
                if (disabled) {
                    if (Abs.isObject(disabled)) {
                        if (disabled.hasOwnProperty($item.key)) {
                            $item.disabled = disabled[$item.key];
                        }
                    } else if (true === disabled) {
                        $item.disabled = disabled;
                    }
                } else {
                    $item.disabled = false;
                }
                const {text, ...rest} = $item;
                return (
                    <Button {...rest}>{text}</Button>
                )
            })}
        </Button.Group>
    )
};
export default {
    aiOpLeft,
}