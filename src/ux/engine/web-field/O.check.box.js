import {Checkbox} from "antd";
import React from "react";
import R from '../expression';
import normalizeAttribute from './I.fn.uniform';
import Abs from '../../abyss';
import U from 'underscore';
/*
    // 处理onChange，解决rest为 {}时引起的参数Bug
    // const rest = Aid.fixAttrs(jsx);
    // 构造Checkbox专用选项
    // R.Ant.onChange(rest, onChange, {
    //     reference, // 增强时需要使用，组件引用
    //     config, // 当前Jsx中的配置
    //     trigger: jsx.trigger, // 触发项
    //     prevent: false,     // 默认行为开启
    // });
    // ReadOnly处理，第二参用于处理disabled的情况，非input使用
    // R.Ant.onReadOnly(rest, true, reference);
    上边是旧代码
 */
const aiCheckbox = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
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
    if (config) {
        const options = R.Ant.toOptions(reference, config);
        /*
         * 特殊初始值，暂时不取消这里的处理
         */
        const initial = jsx['data-initial'];
        if (initial) {
            if (U.isArray(initial)) {
                rest.defaultValue = initial;
            }
        }
        return (
            <Checkbox.Group {...rest} options={options}/>
        )
    } else {
        const $rest = Abs.clone(rest);
        const {onChange, ...left} = $rest;
        return (
            <Checkbox {...left} onChange={onChange}/>
        )
    }
};

const ai2Checkbox = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiCheckbox(reference, jsx, fnChange);
};
export default {
    aiCheckbox,
    ai2Checkbox,
}