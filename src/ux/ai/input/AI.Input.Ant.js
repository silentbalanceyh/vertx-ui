import RxAnt from "../ant/AI.RxAnt";
import Aid from './fix';
import {
    Checkbox,
    DatePicker,
    Input,
    InputNumber,
    Radio,
    Select,
    TimePicker,
    TreeSelect
} from "antd";
import React from "react";

const aiInput = (reference, jsx = {}, onChange) => {
    // 处理prefix属性
    RxAnt.onPrefix(jsx);
    // 处理addonAfter
    RxAnt.onAddonAfter(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    // ReadOnly处理
    RxAnt.onReadOnly(jsx, false, reference);
    // 处理PlaceHolder，先处理readOnly
    RxAnt.onPlaceHolder(jsx);
    return (<Input {...jsx}/>);
};

const aiTreeSelect = (reference, jsx = {}, onChange) => {
    const {config = {}} = jsx;
    // 处理TreeSelect
    const data = RxAnt.toTreeOptions(reference, config);
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    RxAnt.onChange(rest, onChange, {
        reference, // 增强时需要使用，组件引用
        config, // 当前Jsx中的配置
    });
    return (<TreeSelect treeData={data} {...rest}/>);
};

const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    return (<InputNumber {...jsx}/>);
};
const aiSelect = (reference, jsx = {}, onChange) => {
    const {config = {}, filter} = jsx;
    // onChange处理
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    RxAnt.onChange(rest, onChange);
    const options = RxAnt.toOptions(reference, config, filter);
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

const aiRadio = (reference, jsx = {}, onChange) => {
    const {config = {}} = jsx;
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    // onChange处理
    RxAnt.onChange(rest, onChange);
    // ReadOnly处理，第二参用于处理disabled的情况，非input使用
    RxAnt.onReadOnly(rest, true, reference);
    const options = RxAnt.toOptions(reference, config);
    return (
        <Radio.Group {...rest}>
            {options.map(item => (
                <Radio key={item.key} style={item.style ? item.style : {}}
                       value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.label}
                </Radio>
            ))}
        </Radio.Group>
    );
};
const aiCheckbox = (reference, jsx = {}, onChange) => {
    const {config} = jsx;
    // 处理onChange，解决rest为 {}时引起的参数Bug
    const rest = Aid.fixAttrs(jsx);
    // 构造Checkbox专用选项
    RxAnt.onChange(rest, onChange);
    // ReadOnly处理，第二参用于处理disabled的情况，非input使用
    RxAnt.onReadOnly(rest, true, reference);
    const options = RxAnt.toOptions(reference, config);
    return (config) ?
        <Checkbox.Group {...rest} options={options}/> :
        <Checkbox/>;
};
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>);
};
const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    RxAnt.onDisabledDate(jsx);
    // onChange处理
    RxAnt.onChange(jsx, onChange);
    // 处理readOnly
    RxAnt.onReadOnly(jsx, true, reference);
    return (<DatePicker {...jsx} className={"rx-readonly"}/>);
};

const aiTimePicker = (reference, jsx = {}, onChange) => {
    RxAnt.onChange(jsx, onChange);
    return (<TimePicker {...jsx}/>);
};
export default {
    // Label专用组件
    // 直接组件
    aiSelect,
    aiInput,
    aiInputNumber,
    aiCheckbox,
    aiRadio,
    aiTextArea,
    aiTreeSelect,
    aiDatePicker,
    aiTimePicker,
};