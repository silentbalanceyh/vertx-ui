import {Button, Tooltip} from "antd";
import Ux from "ux";
import React from "react";

export default (reference) => {
    const {$extra = [], $tabs = {}, $submitting = false} = reference.state;
    const {items = []} = $tabs;
    return 2 === items.length ? (
        <Button.Group>
            {$extra.map(each => {
                const {text, onClick, ...rest} = each;
                return (
                    <Tooltip title={text} key={rest['key']}>
                        <Button {...rest} loading={$submitting} onClick={event => {
                            Ux.prevent(event);
                            reference.setState({$submitting: true});
                            if (Ux.isFunction(onClick)) {
                                onClick(event);
                            }
                        }}/>
                    </Tooltip>
                )
            })}
        </Button.Group>
    ) : false
}