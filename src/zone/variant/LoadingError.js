import React from 'react';
import {Result} from 'antd';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props = {}) => {
    return (
        <Result status={"error"}>
            <div className={"ux_error"}>
                {props.$message}
            </div>
        </Result>
    )
}