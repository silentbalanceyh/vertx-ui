import React from 'react'
import {Col, Row, Table} from 'antd';
import RxAnt from './AI.RxAnt';

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

const aiGrid = (config = [], ...jsx) => {
    return (
        <Row>
            {config.map((item, index) => {
                const isNum = "number" === typeof item;
                // 表达式处理
                const isExpr = "string" === typeof item && 0 <= item.indexOf(",");
                if (isNum) {
                    return (
                        <Col span={item} key={`$$AiCol${index}`}>
                            {jsx[index] ? jsx[index] : false}
                        </Col>
                    )
                } else if (isExpr) {
                    const attrs = RxAnt.toParsed(item, index);
                    // 重写key值
                    attrs.key = `$$AiCol${index}`;
                    return (
                        <Col {...attrs}>
                            {jsx[index] ? jsx[index] : false}
                        </Col>
                    )
                } else {
                    return false;
                }
            })}
        </Row>
    )
};

const aiTable = (dataSource = [], table = {}) => {
    return (<Table {...table} dataSource={dataSource}/>)
};

export default {
    aiRows,
    aiGrid,
    aiTable
}