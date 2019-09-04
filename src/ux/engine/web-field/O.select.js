import Aid from "./I.fix";
import {Select} from "antd";
import React from "react";
import R from '../expression';
import Abs from '../../abyss';
import Ut from '../../unity';

const aiSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, filter} = jsx;
    // onChange处理
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    R.Ant.onChange(rest, onChange);
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    let $filters = Abs.clone(filter);
    if (config['cascade']) {
        const cascade = config['cascade'];
        const field = cascade.target;
        const value = Ut.formGet(reference, field);
        $filters = item => value === item[cascade.source];
    }
    const options = R.Ant.toOptions(reference, config, $filters);
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