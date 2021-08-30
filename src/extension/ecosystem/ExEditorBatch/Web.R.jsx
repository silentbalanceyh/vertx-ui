import {DatePicker, Input, Radio} from "antd";
import Ux from "ux";
import React from "react";

const rxInput = (reference, key) => (event) => {
    const text = Ux.ambEvent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    reference.setState({$data});
};
export default {
    /* 文本输入框 */
    "TEXT": (reference) => (key, value) => (
        <Input onChange={rxInput(reference, key)} value={value}/>),
    /* 单选 */
    "RADIO": (reference, items = []) => (key) => {
        let options = Ux.Ant.toOptions(reference, {items});
        return (
            <Radio.Group onChange={rxInput(reference, key)}>
                {options.map(option => (
                    <Radio value={option.value} key={option.key}>{option.label}</Radio>))}
            </Radio.Group>
        );
    },
    "DATE": (reference, config = {}) => (key) => {
        const {format = "YYYY/MM/DD"} = config;
        return (
            <DatePicker format={format} className={"ux-readonly"}
                        onChange={rxInput(reference, key)}/>
        );
    }
}