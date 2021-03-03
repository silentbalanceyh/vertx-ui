import Ux from 'ux';
import {Button, Col, Form, Row} from 'antd';
import React from 'react';
import Rdr from './Web.Render';

export default (reference) => {
    const search = Ux.fromHoc(reference, "search");
    const actions = Ux.fromHoc(reference, "action");
    return (
        <Row className={"op-column"}>
            <Col span={9} className={"op-search"}>
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
            <Col span={3}/>
            <Col span={12} className={"action op-extra"}>
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