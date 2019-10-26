import {ExArbor, ExComplexList} from "ei";
import {Col, Row} from 'antd';
import Ex from "ex";
import React from "react";
import Op from './Op';

export default (reference, {
    grid = {},
    form = {},
    category = []
}) => {
    const {$category = false, config = {}} = reference.props;
    if ($category && 0 < category.length) {
        return (
            <Row>
                <Col span={4}>
                    <ExArbor data={category}
                             config={config.tree}
                             fnSelect={Op.rxCategory(reference)}/>
                </Col>
                <Col span={20}>
                    <ExComplexList {...Ex.yoAmbient(reference)}
                                   config={grid} $form={form}/>
                </Col>
            </Row>
        )
    } else {
        console.info(grid);
        return (
            <ExComplexList {...Ex.yoAmbient(reference)}
                           config={grid} $form={form}/>
        )
    }
}