import {Select} from "antd";
import React from "react";

export default (reference, {
    select = {},
    options = []
}) => (
    <Select {...select}>
        {options.map(option => (
            <Select.Option key={option.key}
                           value={option.value}>
                {option.label}
            </Select.Option>
        ))}
    </Select>
)