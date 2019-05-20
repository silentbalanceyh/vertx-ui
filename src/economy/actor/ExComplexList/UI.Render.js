import React from 'react';
import {Button, Col, Row, Table} from 'antd';
import Fn from '../Fx';

const renderAdd = (reference) => {
    const {op = {}} = reference.state;
    if (op.add) {
        const {text, ...rest} = op.add;
        return (
            <Button {...rest}>{text}</Button>
        )
    } else return false;
};

const renderPageList = (reference, item = {}) => {
    const $table = Fn.configTable(reference);
    return (
        <Row>
            <Row>
                {renderAdd(reference)}
            </Row>
            <Row>
                <Col span={24}>
                    <Table {...$table}/>
                </Col>
            </Row>
        </Row>
    );
};
export default {
    "list": renderPageList
}