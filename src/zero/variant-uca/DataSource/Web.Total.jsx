import React from 'react';
import {Tag} from 'antd';
import __Zn from '../zero.uca.dependency';

export default (reference) => (counter) => {
    const comment = __Zn.fromHoc(reference, "comment");
    return (
        <Tag color={"magenta"} style={{fontSize: 14}}>
            {__Zn.formatExpr(comment.counter, {counter})}
        </Tag>
    );
}