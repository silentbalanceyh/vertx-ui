import Ux from 'ux';
import React from 'react';
import {Table} from 'antd';
import './Cab.less';

export default (reference, {
    table = {},
    data = []
}) => Ux.isEmpty(table) ? false : (
    <Table {...table} dataSource={data}/>
)