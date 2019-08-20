import React from 'react';
import {Table} from 'antd';
import Ux from 'ux';

export default (reference, {
    tables = {},
    buttons = {},
}) => (
    <div>
        <Table {...tables}/>
        {Ux.rtPure(reference, buttons)}
    </div>
)