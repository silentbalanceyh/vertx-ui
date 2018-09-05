import Ux from 'ux';
import React from 'react';
import {Icon, Input, InputNumber, Switch} from 'antd';
import Op from './Op';

const renderBoolean = (reference, record) =>
    (<Switch defaultChecked
             onChange={(checked) => Op.setValue(reference, record.hitted, checked)}/>);
const renderInteger = (reference, record) =>
    (<InputNumber min={0} defaultValue={0}
                  onChange={(event) => Op.setValue(reference, record.hitted, event)}/>);
const renderText = (reference, record) =>
    (<Input style={{width: "60%"}}
            onChange={(event) => Op.setValue(reference, record.hitted, event.target.value)}/>);
const RENDER = {
    "BOOLEAN": renderBoolean,
    "INTEGER": renderInteger,
    "TEXT": renderText,
};
const _prepareRecord = (data, key, vector = {}, isOpt = false) => {
    const record = {};
    record.key = Ux.randomUUID();
    if (isOpt) {
        record.field = "options";
        record.option = key;
        record.hitted = key;
    } else {
        record.field = key;
        record.hitted = key;
    }
    const hittedKey = data[key];
    record.op = hittedKey;
    // 数据类型处理
    const icon = vector.icon[hittedKey];
    record.icon = Op.setIcon(icon);
    record.text = vector.text[hittedKey];
    return record;
};
const prepareData = (reference, data = {}) => {
    const records = [];
    const vector = Ux.fromHoc(reference, "vector");
    // 非Option
    Object.keys(data).filter(key => "options" !== key)
        .forEach(key => records.push(_prepareRecord(data, key, vector)));
    // Option
    Object.keys(data).filter(key => "options" === key).forEach(key => {
        const option = data[key];
        Object.keys(option)
            .forEach(optionKey => records.push(_prepareRecord(option, optionKey, vector, true)))
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