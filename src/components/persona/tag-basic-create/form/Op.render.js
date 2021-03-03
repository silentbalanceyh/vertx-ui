import React from 'react';
import Ux from "ux";
import {Select} from "antd";

const renderSelect = (reference, rowKey, field, source, defaultValue) => {
    return (
        <Select className={"ops-dropdown"}
                defaultValue={defaultValue}
                onChange={Ux.xtRowChange(reference, rowKey, field)}>
            {source.map(item => {
                return (
                    <Select.Option value={item.id} key={item.id}>
                        {item.name}
                    </Select.Option>
                )
            })}
        </Select>
    )
}
const renderConnector = (reference, rowKey) => {
    const connector = ["=", "<", ">", "!=", "<=", ">="];
    const source = [];
    connector.forEach(item => {
        const option = {};
        option.id = item;
        option.name = item;
        source.push(option)
    });
    return renderSelect(reference, rowKey, "where", source, "=");
}

export default {
    renderSelect,
    renderConnector,
}