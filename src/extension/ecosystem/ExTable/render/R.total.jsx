import React from 'react';
import {Tag} from "antd";

export default ({selected, selectJsx, reportJsx}) => (
    <span>
        {selected ? (
            <Tag color={"magenta"}>
                {selectJsx}
            </Tag>
        ) : false}
        {reportJsx}
    </span>
)