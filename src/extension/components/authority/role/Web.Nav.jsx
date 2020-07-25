import Ux from 'ux';
import {Button, Col, Form, Row} from 'antd';
import React from 'react';
import Rdr from './Web.Child.Op';

export default (reference) => {
    const search = Ux.fromHoc(reference, "search");
    const actions = Ux.fromHoc(reference, "action");
    const clean = Ux.fromHoc(reference, "clean");
    return (
        <Row className={"op-column"}>
            <Col span={7}>
                <Form.Item label={search.label}
                           labelCol={{span: 8}}
                           wrapperCol={{span: 16}}>
                    {(() => {
                        const $jsx = Ux.clone(search.jsx);
                        const {$op = {}} = reference.state;
                        $jsx.onChange = $op.$opSelect;
                        const {$role} = reference.state;
                        $jsx.value = $role ? $role['roleName'] : undefined;
                        return Ux.aiListSelector(reference, $jsx);
                    })()}
                </Form.Item>
            </Col>
            <Col span={1} className={"action"}>
                {Rdr.renderOp(reference, clean)}
            </Col>
            <Col span={4} className={"action"}>
                {Rdr.renderLogin(reference)}
            </Col>
            <Col span={12} className={"action"}>
                {(() => {
                    return (
                        <Button.Group>
                            {actions.map(action => Rdr.renderOp(reference, action))}
                        </Button.Group>
                    )
                })()}
            </Col>
            <Col span={10}/>
        </Row>
    )
}