import Ux from 'ux';
import {Table} from 'antd';
import React from 'react';

const renderModel = (reference, data = [], key) => {
    const table = Ux.fromHoc(reference, "table");
    const config = table[key];
    config.pagination = false;
    config.defaultExpandAllRows = true;
    config.columns = Ux.uiTableColumn(reference, config.columns);
    return (
        <Table {...config} dataSource={data}/>
    )
};

export default {
    renderModel
}