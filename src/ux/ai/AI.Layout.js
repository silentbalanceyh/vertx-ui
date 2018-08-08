import React from 'react'
import {Col, Row, Table} from 'antd';
import RxAnt from './AI.RxAnt';
import LayoutType from './AI.Layout.Config';

/**
 * 直接渲染多行
 * @param config
 * @param jsx
 * @returns {any[]}
 */
const aiRows = (config = [], ...jsx) => (config.map((row, index) => (
    <Row className={row ? row : ""} key={`$$AiRow${index}`}>
        <Col span={24}>
            {jsx[index]}
        </Col>
    </Row>
)));

const aiColumns = (config = [], ...jsx) => {
    return config.map((item, index) => {
        const isNum = "number" === typeof item;
        // 表达式处理
        const isExpr = "string" === typeof item && 0 <= item.indexOf(",");
        if (isNum) {
            return (
                <Col span={item} key={`$$AiCol${index}$Number`}>
                    {jsx[index] ? jsx[index] : false}
                </Col>
            )
        } else if (isExpr) {
            const attrs = RxAnt.toParsed(item, index);
            // 重写key值
            attrs.key = `$$AiCol${index}$String`;
            return (
                <Col {...attrs}>
                    {jsx[index] ? jsx[index] : false}
                </Col>
            )
        } else {
            return false;
        }
    });
};

const aiGrid = (config = [], ...jsx) => {
    return (
        <Row>
            {aiColumns.apply(this, [config].concat(jsx))}
        </Row>
    )
};

const aiTable = (dataSource = [], table = {}) => {
    return (<Table {...table} dataSource={dataSource}/>)
};

const aiAdjust = (window = 1) => {
    if (LayoutType[window]) {
        return LayoutType[window];
    }
};

export default {
    aiRows,
    aiGrid,
    aiColumns,
    aiTable,
    aiAdjust
}