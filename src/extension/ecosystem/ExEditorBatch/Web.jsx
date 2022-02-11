import {DatePicker, Input, InputNumber, Radio, Select} from "antd";
import Ux from "ux";
import React from "react";

const rxInput = (reference, key) => (event) => {
    const text = Ux.ambEvent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    reference.setState({$data});
};
const rxInputNumber = (reference, key) => (event) => {
    let text = Ux.ambEvent(event);
    text = Ux.valueInt(text, 0);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    reference.setState({$data});
};
const attrAddon = (configuration = {}) => {
    const {config = {}} = configuration;
    const {expression = {}} = config ? config : {};
    const attr = {};
    if (expression.before) {
        attr.addonBefore = expression.before;
    }
    if (expression.after) {
        attr.addonAfter = expression.after;
    }
    return attr;
}
const renderRadio = (reference, configuration = {}) => (key) => {
    const {config = {}} = configuration;
    const options = Ux.Ant.toOptions(reference, config);
    return (
        <Radio.Group onChange={rxInput(reference, key)}>
            {options.map(option => (
                <Radio value={option.value} key={option.key}>{option.label}</Radio>))}
        </Radio.Group>
    );
};
export default {
    /* 文本输入框 */
    "TEXT": (reference, configuration) => (key, value) => {
        const attrs = attrAddon(configuration);
        return (
            <Input {...attrs} onChange={rxInput(reference, key)} value={value}/>
        )
    },
    /* 单选 */
    "RADIO": renderRadio,
    "LOGICAL": renderRadio,
    "DATE": (reference, configuration = {}) => (key) => {
        const {config = {}} = configuration;
        const {format = "YYYY/MM/DD"} = config;
        return (
            <DatePicker format={format} className={"ux-readonly"}
                        style={{width: "100%"}}
                        onChange={rxInput(reference, key)}/>
        );
    },
    "CURRENCY": (reference) => (key) => {
        return (
            <InputNumber min={0} precision={2}
                         style={{width: "60%"}}
                         onChange={rxInput(reference, key)}/>
        )
    },
    "NUMBER": (reference, configuration = {}) => (key, value) => {
        const attrs = attrAddon(configuration);
        return (
            <Input {...attrs} onChange={rxInputNumber(reference, key)} value={value}/>
        )
    },
    "DATUM": (reference, configuration = {}) => (key, value) => {
        const {config = {}} = configuration;
        const {options = []} = config;
        return (
            <Select value={value} onChange={rxInput(reference, key)}
                    style={{width: "100%"}}>
                {options.map(option => (
                    <Select.Option key={option.key} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}