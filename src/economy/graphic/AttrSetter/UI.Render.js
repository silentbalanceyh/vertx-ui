import Ux from 'ux';
import React from 'react';
import {Icon, Switch} from 'antd';
import Op from './Op';

const prepareData = (data = {}) => {
    const records = [];
    Object.keys(data).forEach(key => {
        const record = {};
        record.key = Ux.randomUUID();
        record.field = key;
        record.op = data[key];
        if ("BOOLEAN" === data[key]) {
            record.icon = Op.setIcon("api")
        }
        records.push(record);
    });
    return records;
};
const renderBoolean = (reference, record) =>
    (<Switch defaultChecked onChange={(checked) => Op.setValue(reference, record.field, checked)}/>);
const RENDER = {
    "BOOLEAN": renderBoolean
};
const prepareRender = (reference, columns = {}) => {
    columns.forEach(column => {
        if ("icon" === column.dataIndex) {
            column.render = (text) => (<Icon {...text}/>)
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