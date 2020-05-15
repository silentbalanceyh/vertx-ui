import Ux from 'ux';
import React from 'react';
import {Input, Select} from 'antd';

export default (reference) => (props) => {
    const {value = {}} = reference.props;
    const {options = [], ...rest} = props;
    const $attrs = Ux.clone(rest);
    $attrs.style = {
        minWidth: "50%",
        width: "50%"
    }
    if ("MYSQL5" === value.category) {
        /* 下拉专用 */
        return (
            <Select {...$attrs} value={value['driverClassName']}>
                {options.map(option => (
                    <Select.Option key={option.key} value={option.key}>
                        {option.text}
                    </Select.Option>
                ))}
            </Select>
        );
    } else {
        delete $attrs.onChange;
        if (!$attrs.value) {
            delete $attrs.placeholder;
        }
        return (
            <Input {...$attrs} value={value['driverClassName']} readOnly/>
        )
    }
}