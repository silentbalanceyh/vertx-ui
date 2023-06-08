import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import {Select} from "antd";
import {_Ant} from 'zo';
import __Zn from './zero.uca.dependency';

// import Select from './O.select';
const aiSelect = (reference, input = {}, onChange) => {
    const {fnFilter = () => true, ...jsx} = input;
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    const {config = {}, depend} = jsx;
    const options = _Ant.toOptions(reference, {
        ...config,
        initialize: jsx[__Zn.Env.K_NAME._DATA_SOURCE]
    }, fnFilter);
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = __Yo.yoNormalize(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时需要禁用
        options,
    }, onChange);
    /*
     * Linker处理，修改 onChange
     */
    _Ant.onChange(rest, onChange, {
        config, options,
        depend,
        reference
    });
    if (!rest.disabled && !rest.readOnly) {
        rest.filterOption = __Yo.yoFilterOption;
    }
    // 没有任何内容时候的 100% 宽度处理
    if (!rest.style) {
        rest.style = {width: "100%"};
    }
    _Ant.onReadOnly(rest, true, reference);
    // 处理PlaceHolder，先处理readOnly
    if (rest.readOnly) {
        _Ant.onCssClass(rest, "ux_select");
    }
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
export default {
    aiSelect,
}