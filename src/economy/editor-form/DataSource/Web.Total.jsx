import Ux from 'ux';
import React from 'react';
import {Tag} from 'antd';

export default (reference) => (counter) => {
    const comment = Ux.fromHoc(reference, "comment");
    return (
        <Tag color={"magenta"} style={{fontSize: 14}}>
            {Ux.formatExpr(comment.counter, {counter})}
        </Tag>
    );
}