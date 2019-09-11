import {Select} from "antd";
import React from "react";
import R from '../expression';
import normalizeAttribute from './I.fn.uniform';
/*
 *
    // onChange处理
    // 处理onChange，解决rest为 {}时引起的参数Bug
    // const rest = Aid.fixAttrs(jsx);
 */
const aiSelect = (reference, jsx = {}, onChange) => {
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    const {config = {}} = jsx;
    let cascade = R.Ant.toCascade(reference, config);
    const options = R.Ant.toOptions(reference, config, cascade);
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时需要禁用
        options,
    }, onChange);
    /*
     * Linker处理，修改 onChange
     */
    R.Ant.onChange(rest, onChange, {config, options, reference});
    return (
        <Select {...rest}>
            {options.map(item => (
                <Select.Option key={item.key} value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
    );
};
const ai2Select = (onChange) => (reference, jsx = {}) => {
    const fnChange = onChange.apply(null, [reference]);
    return aiSelect(reference, jsx, fnChange);
};
export default {
    aiSelect,
    ai2Select,
}