import Ux from "ux";
import React from 'react';
import {Select} from 'antd';
import Fx from '../Fx';

const onChange = (reference, record) => (select) => {
    let {$data = []} = reference.state;
    $data.filter(item => record === item.key).forEach(each => {
        each.name = select; // 根据字段选择
        if (!each.hasOwnProperty('value')) {
            delete each.value;  // 清空值
        }
    });
    $data = Ux.clone($data);
    reference.setState({$data});
};

export default (reference, config = {}) => (text, record, index) => {
    let options = Ux.RxAnt.toOptions(reference, config);
    const {$data = []} = reference.state;
    const $existing = Ux.immutable($data.map(each => each.name)
        .filter(item => undefined !== item));
    // 先执行列过滤
    options = Fx.mapOptions(reference, options);
    // 当前操作
    // 1. 条件1，$existing中包含的不显示
    // 2. 条件2，当前记录依旧显示
    options = options.filter(option => !$existing.contains(option.value) || option.value === text);
    return (
        <Select style={{minWidth: 200}} onChange={onChange(reference, record.key)}>
            {options.map(option => (
                <Select.Option key={option.key}
                               value={option.value}>{option.label}</Select.Option>
            ))}
        </Select>
    );
}