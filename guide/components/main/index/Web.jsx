import Ux from 'ux';
import React from 'react';
import {Table} from 'antd';

export default (reference, config) => {
    const source = config.source;
    const data = Ux.onDatum(reference, source);
    const table = config.table;
    if (table) {
        const $table = Ux.clone(table);
        $table.bordered = false;
        $table.pagination = {pageSize: 5};
        $table.size = "small";
        $table.columns = Ux.configColumn(reference, table.columns);
        return (
            <Table {...$table} dataSource={data}/>
        )
    } else return false;
}