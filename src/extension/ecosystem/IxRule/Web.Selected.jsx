import React from 'react';
import {Table} from 'antd';

export default (reference) => {
    const {$table = {}, data = []} = reference.state;
    return (
        <Table {...$table} dataSource={data}/>
    )
}
