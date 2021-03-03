import React from 'react';
import {InputNumber, Select} from 'antd';
import Ux from 'ux';
import Op from './Op.Step2';

const renderSelect = (reference, each = {}) => {
    const {items, ...jsx} = each;
    const options = Ux.aiExprOption(items);
    const {$inited = {}} = reference.state;
    return (
        <Select {...jsx} allowClear
                value={$inited[each.field]}
                style={{
                    width: 80,
                    marginLeft: 3,
                    marginRight: 3
                }} onChange={Op.rxChange(reference, each.field)}>
            {options.map(option => {
                return (
                    <Select.Option key={option.key} value={option.value}>
                        {option.label}
                    </Select.Option>
                )
            })}
        </Select>
    )
}

export default (reference, item) => {
    const {$inited = {}} = reference.state;
    if ("TIME" === item.key) {
        const {data = {}} = item;
        return (
            <div>
                {data[0]}
                {((each = {}) => {
                    each.disabled = "TIME" !== $inited.runMode;
                    return renderSelect(reference, each);
                })(data[1])}
                {data[2]}
                {((each) => {
                    each.disabled = "TIME" !== $inited.runMode;
                    return (
                        <InputNumber min={1} max={9}
                                     disabled={each.disabled}
                                     value={$inited[each.field]}
                                     style={{
                                         width: 60,
                                         marginLeft: 3,
                                         marginRight: 3
                                     }} onChange={Op.rxChange(reference, each.field)}/>
                    )
                })(data[3])}
                {data[4]}
            </div>
        )
    } else if ("DURATION" === item.key) {
        const {data = {}} = item;
        return (
            <div>
                {data[0]}
                {((each) => {
                    each.disabled = "DURATION" !== $inited.runMode;
                    return (
                        <InputNumber min={1} max={9}
                                     disabled={each.disabled}
                                     value={$inited[each.field]}
                                     style={{
                                         width: 60,
                                         marginLeft: 3,
                                         marginRight: 3
                                     }} onChange={Op.rxChange(reference, each.field)}/>
                    )
                })(data[1])}
                {((each = {}) => {
                    each.disabled = "DURATION" !== $inited.runMode;
                    return renderSelect(reference, each);
                })(data[2])}
                {data[3]}
            </div>
        )
    } else return false;
}