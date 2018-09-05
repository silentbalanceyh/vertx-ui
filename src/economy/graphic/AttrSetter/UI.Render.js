import Ux from 'ux';
import React from 'react';
import {Icon, Input, InputNumber, Switch} from 'antd';
import Op from './Op';

const renderBoolean = (reference, record) =>
    (<Switch defaultChecked
             onChange={(checked) => Op.setValue(reference, record.field, checked)}/>);
const renderInteger = (reference, record) =>
    (<InputNumber min={0} defaultValue={0}
                  onChange={(event) => Op.setValue(reference, record.field, event)}/>);
const renderText = (reference, record) =>
    (<Input style={{width: "60%"}}
            onChange={(event) => Op.setValue(reference, record.field, event.target.value)}/>);
const RENDER = {
    "BOOLEAN": renderBoolean,
    "INTEGER": renderInteger,
    "TEXT": renderText,
};
const prepareData = (reference, data = {}) => {
    const records = [];
    const vector = Ux.fromHoc(reference, "vector");
    Object.keys(data).forEach(key => {
        const record = {};
        record.key = Ux.randomUUID();
        record.field = key;
        const hittedKey = data[key];
        record.op = hittedKey;
        // 数据类型处理
        const icon = vector.icon[hittedKey];
        record.icon = Op.setIcon(icon);
        record.text = vector.text[hittedKey];
        records.push(record);
    });
    return records;
};
const prepareRender = (reference, columns = {}) => {
    columns.forEach(column => {
        if ("icon" === column.dataIndex) {
            column.render = (text, record) => (
                <span>
                    <Icon {...text}/>&nbsp;&nbsp;{record.text}
                </span>
            )
        }
        if ("op" === column.dataIndex) {
            column.render = (text, record) => RENDER[text](reference, record)
        }
    })
};
export default {
    prepareData,
    prepareRender
}