import React from 'react';
import {Select, Table} from 'antd';
import Ux from 'ux';

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
    )
}