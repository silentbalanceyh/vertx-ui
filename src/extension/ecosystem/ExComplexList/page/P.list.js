import Ux from "ux";
import Ex from 'ex';
import React from 'react';
import {Col, Row} from 'antd';

export default (reference, item = {}) => {
    const {
        css = {}
    } = reference.props;
    const {
        clsRow = Ux.ECONOMY.ROW_HEAD
    } = css;
    /*
     * 处理 op 相关信息
     */
    const openAttrs = Ex.U.yoOpen(reference, item);
    console.info(openAttrs);
    return (
        <Row>
            <Row className={clsRow}>
                <Col span={4} xl={4} xxl={3}>
                    Open
                </Col>
                <Col span={9} xl={9} xxl={12}>
                    Batch
                </Col>
                <Col span={8} xl={8} xxl={7}>
                    Search
                </Col>
                <Col span={3} xl={3} xxl={2}>
                    Extra
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    Table
                </Col>
            </Row>
        </Row>
    );
}