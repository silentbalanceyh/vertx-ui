import {DatePicker, Input, Radio} from "antd";
import React from "react";
import Event from './Op.Event';
import Ux from "ux";

export default {
    /* 文本输入框 */
    "TEXT": (reference) => (key, value) => (
        <Input onChange={Event.rxInput(reference, key)} value={value}/>),
    /* 单选 */
    "RADIO": (reference, items = []) => (key) => {
        let options = Ux.Ant.toOptions(reference, {items});
        return (
            <Radio.Group onChange={Event.rxInput(reference, key)}>
                {options.map(option => (
                    <Radio value={option.value} key={option.key}>{option.label}</Radio>))}
            </Radio.Group>
        );
    },
    "DATE": (reference, config = {}) => (key) => {
        const {format = "YYYY/MM/DD"} = config;
        return (
            <DatePicker format={format} className={"ux-readonly"}
                        onChange={Event.rxInput(reference, key)}/>
        );
    }
}