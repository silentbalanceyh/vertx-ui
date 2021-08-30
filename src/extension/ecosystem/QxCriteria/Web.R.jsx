import {DatePicker, Input, InputNumber, Radio, Select} from "antd";
import React from "react";
import Ux from 'ux';

const rxInput = (reference) => (event) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.value = Ux.ambEvent(event);
    reference.setState({$waiting});
}
const attrAddon = (configuration) => {
    const {item = {}} = configuration;
    const {expression = {}} = item.config ? item.config : {};
    const attr = {};
    if (expression.before) {
        attr.addonBefore = expression.before;
    }
    if (expression.after) {
        attr.addonAfter = expression.after;
    }
    return attr;
}
export default {
    "TEXT": (reference, configuration = {}) => {
        const {$waiting = {}} = reference.state;
        const {info = {}} = configuration.config;
        const {hint = {}} = info;
        const attrs = attrAddon(configuration);
        return (
            <div className={"dynamic"}>
                <Input placeholder={hint['TEXT']}
                       value={$waiting.value}
                       {...attrs}
                       onChange={rxInput(reference)}/>
            </div>
        )
    },
    "LOGICAL": (reference, configuration = {}) => {
        const {$waiting = {}} = reference.state;
        const {item = {}} = configuration;
        const {mapping = {}} = item.config ? item.config : {};
        return (
            <Radio.Group value={$waiting.value}
                         onChange={rxInput(reference)}>
                <Radio value={"true"}>{mapping[true]}</Radio>
                <Radio value={"false"}>{mapping[false]}</Radio>
            </Radio.Group>
        )
    },
    "DATE": (reference, configuration = {}) => {
        const {item = {}} = configuration;
        const {format = "YYYY/MM/DD"} = item.config;
        return (
            <DatePicker format={format} className={"ux-readonly"}
                        onChange={rxInput(reference)}/>
        )
    },
    "CURRENCY": (reference) => {
        const {$waiting = {}} = reference.state;
        return (
            <div className={"dynamic"}>
                <InputNumber value={$waiting.value}
                             min={0}
                             precision={2}
                             onChange={rxInput(reference)}/>
            </div>
        );
    },
    "DATUM": (reference, configuration = {}) => {
        const {$waiting = {}} = reference.state;
        const {item = {}} = configuration;
        const {options = []} = item.config ? item.config : {}
        const attrs = {};
        if (["i", "!i"].includes($waiting.op)) {
            attrs.mode = "multiple";
        }
        return (
            <div className={"dynamic"}>
                <Select {...attrs} style={{width: "100%"}} value={$waiting.value}>
                    {options.map(option => (
                        <Select.Option key={option.key} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        )
    }
}