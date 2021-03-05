import React from 'react';
import Event from '../event';
import {Icon} from 'antd';

export default (reference, opText) => ({
    dataIndex: "key",
    className: "row-remove",
    render: (text, record) => (
        // eslint-disable-next-line
        <a onClick={Event.onRemove(reference, record)}>
            <Icon type={"delete"}/>
            &nbsp;&nbsp;
            {opText}
        </a>
    )
})