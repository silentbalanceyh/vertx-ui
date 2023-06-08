import __ZN from './zero.uca.func.dependency';
import __ADD_ON from '../form.equip.__.fn.raft.action';

import {Button} from 'antd';
import React from 'react';

const __Zn = {
    ...__ZN,
    ...__ADD_ON,
}
const aiSubmit = (reference, optionJsx = {}) => {
    const cell = {optionJsx};
    __Zn.raftAction(cell, reference);
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
    aiSubmit,
}