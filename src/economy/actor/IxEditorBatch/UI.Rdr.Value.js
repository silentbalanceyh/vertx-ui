import Ux from "ux";
import React from 'react';
import {DatePicker, Input, Radio} from 'antd';

const onInput = (reference, key) => (event) => {
    const text = Ux.annexValue(event);
    let {$data = []} = reference.state;
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    $data = Ux.clone($data);
    reference.setState({$data});
};
const RENDERS = {
    "TEXT": (reference) => (key, value) => (
        <Input onChange={onInput(reference, key)} value={value}/>),
    "RADIO": (reference, items = []) => (key) => {
        let options = Ux.RxAnt.toOptions(reference, {items});
        return (
            <Radio.Group onChange={onInput(reference, key)}>
                {options.map(option => (
                    <Radio value={option.value} key={option.key}>{option.label}</Radio>))}
            </Radio.Group>
        )
    },
    "DATE": (reference, config = {}) => (key) => {
        const {format = "YYYY/MM/DD"} = config;
        return (
            <DatePicker format={format} className={"ux-readonly"}
                        onChange={onInput(reference, key)}/>
        )
    }
};
const onRender = (reference, column = {}, renders = {}) => {
    const raw = renders[column.key];
    if ("string" === typeof raw) {
        return RENDERS[raw](reference);
    } else {
        const {type, config} = raw;
        return RENDERS[type](reference, config);
    }
};
export default (reference, config = {}, renders = {}) => (text, record, index) => {
    let options = Ux.RxAnt.toOptions(reference, config);
    // 选中行
    let column = options.filter(option => option.value === record.name);
    if (1 === column.length) {
        column = column[0];
        const jsx = onRender(reference, column, renders);
        return jsx(record.key, text);
    } else {
        const jsx = RENDERS["TEXT"];
        return jsx(record.key, text);
    }
}