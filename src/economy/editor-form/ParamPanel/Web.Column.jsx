import React from 'react';
import {Icon} from 'antd';
import Op from './op';

export default (reference, op = {}) => {
    return {
        dataIndex: "key",
        render: (text) => (
            // eslint-disable-next-line
            <a href={""} onClick={Op.onRowRemove(reference, text)}>
                <Icon type={"delete"}/>
                &nbsp;&nbsp;
                {op.remove}
            </a>
        )
    }
}