import {Col, Row} from "antd";
import React from "react";
import './Cab.less';
import Ux from "ux";
import Ex from 'ex';

import ExAction from '../../ExAction/UI';
import ExTable from '../../ExTable/UI';

const renderSearch = (reference) => {
    const {$form = {}} = reference.props;
    const Component = $form.FormSearch;
    if (Component) {
        const attrs = Ex.yoListSearch(reference);
        return (
            <Component {...attrs}/>
        )
    } else return false;
}

export default (reference, {
    css: {
        clsRow = Ux.Env.ECONOMY.ROW_HEAD
    },
    opens = {},  // Open区域
    extra = {},  // Extra区域
    table = {},  // Table专用
}) => {
    const layout = {};
    if (0 === opens.config.length) {
        layout.left = {
            span: 0,
            xl: 0,
            xxl: 0
        }
    } else {
        layout.left = {
            span: 1,
            xl: 1,
            xxl: 2
        }
    }
    if (0 === extra.config.length) {
        layout.right = {
            span: 0,
            xl: 0,
            xxl: 0
        }
    } else {
        layout.right = {
            span: 2,
            xl: 2,
            xxl: 3
        }
    }
    layout.middle = {
        span: 24 - layout.left.span - layout.right.span,
        xl: 24 - layout.left.xl - layout.right.xl,
        xxl: 24 - layout.left.xxl - layout.right.xxl,
    }
    return (
        <Row>
            <Row className={clsRow}>
                <Col {...layout.left}>
                    {0 < opens.config.length ? (<ExAction {...opens}/>) : false}
                </Col>
                <Col {...layout.middle}>
                    {renderSearch(reference)}
                </Col>
                <Col {...layout.right} className={"ex-extra"}>
                    {0 < extra.config.length ? (<ExAction {...extra}/>) : false}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <ExTable {...table}/>
                </Col>
            </Row>
        </Row>
    )
}