import {DatePicker, Input, Radio} from "antd";
import React from "react";
import Ux from 'ux';

const rxInput = (reference) => (event) => {
    let {$waiting = {}} = reference.state;
    $waiting = Ux.clone($waiting);
    $waiting.value = Ux.ambEvent(event);
    reference.setState({$waiting});
}

export default {
    "TEXT": (reference, configuration = {}) => {
        const {$waiting = {}} = reference.state;
        const {info = {}} = configuration.config;
        const {hint = {}} = info;
        return (
            <div className={"dynamic"}>
                <Input placeholder={hint['TEXT']}
                       value={$waiting.value}
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
    }
}