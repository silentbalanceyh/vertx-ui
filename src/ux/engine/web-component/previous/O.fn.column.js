import Raft from '../../../engine/raft';
import React from 'react';
import {Col} from 'antd';
import jsxItem from './O.fn.item';

export default (reference, renders, item = {}, layout = {}) => {
    const fnRender = Raft.raftRender(item, renders, layout, reference);
    if (fnRender) {
        // 渲染
        const {span} = layout;
        return (
            <Col span={item.span ? item.span : span} key={item.field}
                 style={Raft.raftColumn(item)}>
                {/** 渲染字段 **/}
                {jsxItem(reference, item,
                    fnRender ? fnRender : () => false)}
            </Col>
        );
    } else return false;
};