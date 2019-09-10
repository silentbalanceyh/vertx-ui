import Aid from "./I.fix";
import {Select} from "antd";
import React from "react";
import R from '../expression';

const aiSelect = (reference, jsx = {}, onChange) => {
    const {config = {}} = jsx;
    // onChange处理
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    let cascade = R.Ant.toCascade(reference, config);

    const options = R.Ant.toOptions(reference, config, cascade);
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