import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import {Radio} from "antd";
import {_Ant} from 'zo';

// import Radio from './O.radio';
const aiRadio = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    __Yo.yoCssAdjust(jsx, "radio");
    const rest = __Yo.yoNormalize(reference, {
        ...jsx,
        eventDisabled: true,         // 只读时候需要禁用
    }, onChange);
    // 处理 Radio 相关
    const {config = {}} = jsx;
    const options = _Ant.toOptions(reference, config);
    // true / false 专用，不影响 Select 的专用处理
    if (2 === options.length) {
        options.forEach(option => {
            if ("true" === option.value) {
                option.value = true;
            }
            if ("false" === option.value) {
                option.value = false;
            }
        })
    }
    // Radio的另外一种模式开启
    const {type = "RADIO"} = config;
    const Component = "RADIO" === type ? Radio : Radio.Button;
    // __Yo.yoInitial(rest, jsx, reference)
    _Ant.onReadOnly(rest, true, reference);
    return (
        <Radio.Group {...rest}>
            {options.map(item => (
                <Component key={item.key} style={item.style ? item.style : {}}
                           value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.label}
                </Component>
            ))}
        </Radio.Group>
    );
};
export default {
    aiRadio,
}