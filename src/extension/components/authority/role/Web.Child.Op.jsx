import Ux from "ux";
import {Button, Checkbox, Tooltip} from "antd";
import Op from "./op";
import React from "react";

export default {
    renderLogin: (reference) => {
        const checked = Ux.fromHoc(reference, "checked");
        const {$role} = reference.state;
        const attrs = {};
        attrs.disabled = undefined === $role;
        if ($role) {
            attrs.checked = Op.isLogin(reference);
        }
        return (
            <div>
                <Checkbox {...attrs}
                          onChange={Op.rxLogin(reference)}/>
                &nbsp;&nbsp;{checked.login}
            </div>
        )
    },
    renderOp: (reference, action = {}) => {
        const {text, tooltip, ...rest} = action;
        const {$op = {}} = reference.state;
        const executor = $op[rest.key];
        if (Ux.isFunction(executor)) {
            rest.onClick = executor;
        }
        const {$role} = reference.state;
        rest.disabled = undefined === $role;
        return text ? (
            <Button {...rest}>
                {text}
            </Button>
        ) : (
            <Tooltip key={rest.key} title={tooltip}>
                <Button {...rest}/>
            </Tooltip>
        )
    }
}