import React from 'react';
import {Button, DatePicker, Input, Radio, Select, Table} from 'antd';
import Ux from 'ux';
import Op from "./Op";

export default {
    renderEditor: (reference, {
        tables = {},
        buttons = {},
    }) => (
        <div className={"ex-editor-table"}>
            <Table {...tables}/>
            {Ux.aiButton(reference, buttons)}
        </div>
    ),
    renderOp: (reference, {
        left,
        right
    }) => (
        <Button.Group>
            <Button {...left}/>
            <Button {...right}/>
        </Button.Group>
    ),
    renderField: (reference, {
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
    ),
    RENDERS: {
        /* 文本输入框 */
        "TEXT": (reference) => (key, value) => (
            <Input onChange={Op.rxInput(reference, key)} value={value}/>),
        /* 单选 */
        "RADIO": (reference, items = []) => (key) => {
            let options = Ux.Ant.toOptions(reference, {items});
            return (
                <Radio.Group onChange={Op.rxInput(reference, key)}>
                    {options.map(option => (
                        <Radio value={option.value} key={option.key}>{option.label}</Radio>))}
                </Radio.Group>
            );
        },
        "DATE": (reference, config = {}) => (key) => {
            const {format = "YYYY/MM/DD"} = config;
            return (
                <DatePicker format={format} className={"ux-readonly"}
                            onChange={Op.rxInput(reference, key)}/>
            );
        }
    }
}