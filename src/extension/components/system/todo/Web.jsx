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
    const {
        $category = false, config = {}
    } = reference.props;
    const {$query = {}} = reference.state;
    if ($category && 0 < category.length) {
        const {$opened = false} = reference.state;
        return (
            <Row>
                <Col span={$opened ? 0 : 4}>
                    <ExArbor data={category}
                             config={config.tree}
                             fnSelect={Op.rxCategory(reference)}/>
                </Col>
                <Col span={$opened ? 24 : 20}>
                    <ExComplexList {...Ex.yoAmbient(reference)}
                                   config={grid} $form={form}
                                   $query={$query}
                                   rxOpenPost={Ex.rxOpenPost(reference)}
                                   rxClosePost={Ex.rxClosePost(reference)}/>
                </Col>
            </Row>
        )
    } else {
        return (
            <ExComplexList {...Ex.yoAmbient(reference)}
                           $query={$query}
                           config={grid} $form={form}/>
        )
    }
}