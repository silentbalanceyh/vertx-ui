import Ux from "ux";
import React from 'react';
import {Input} from 'antd';

const onInput = (reference, key) => (event) => {
    const text = event.target.value;
    let {$data = []} = reference.state;
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    $data = Ux.clone($data);
    reference.setState({$data});
};
const RENDERS = {
    "DEFAULT": (reference, key, value) => (
        <Input onChange={onInput(reference, key)} value={value}/>)
};
export default (reference, config = {}) => (text, record, index) => {
    let options = Ux.RxAnt.toOptions(reference, config);
    // 选中行
    let column = options.filter(option => option.value === record.name);
    if (1 === column.length) {
        column = column[0];
        const {$render = "DEFAULT"} = column;
        const jsx = RENDERS[$render];
        return jsx(reference, record.key, text);
    } else {
        const jsx = RENDERS["DEFAULT"];
        return jsx(reference, record.key, text);
    }
}