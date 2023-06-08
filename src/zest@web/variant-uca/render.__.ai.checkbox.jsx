import __Yo from './field.__.fn.yo.configuration';
import __Zn from './zero.uca.func.dependency';
import React from 'react';
import {Checkbox, Switch} from "antd";
import {_Ant} from 'zo';

// import Checkbox from './O.check.box';
const aiCheckbox = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = __Yo.yoNormalize(reference, {
        ...jsx,
        eventPrevent: false,        // 不关闭默认行为
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    /*
     * 分流：
     * 1）多选
     * 2）单选
     */
    const {config} = jsx;
    if (__Zn.isNotEmpty(config)) {
        const options = _Ant.toOptions(reference, config);
        return (
            <Checkbox.Group {...rest} options={options}/>
        )
    } else {
        const $rest = __Zn.clone(rest);
        const {onChange, mode, ...left} = $rest;
        if ("SWITCH" === mode) {
            return (<Switch {...left} onChange={onChange}/>)
        } else {
            return (<Checkbox {...left} onChange={onChange}/>)
        }
    }
};
export default {
    aiCheckbox,
}