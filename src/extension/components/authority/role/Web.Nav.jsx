import Ux from 'ux';
import {Button, Col, Form, Row} from 'antd';
import React from 'react';
import Op from './Op';

export default (reference) => {
    const search = Ux.fromHoc(reference, "search");
    const actions = Ux.fromHoc(reference, "action")
    return (
        <Row className={"op-column"}>
            <Col span={8}>
                <Form.Item label={search.label}
                           labelCol={{span: 8}}
                           wrapperCol={{span: 16}}>
                    {(() => {
                        const $jsx = Ux.clone(search.jsx);
                        $jsx.onChange = Op.actions.$opSelect(reference);
                        const {$role} = reference.state;
                        $jsx.value = $role ? $role['roleName'] : undefined;
                        return Ux.aiListSelector(reference, $jsx);
                    })()}
                </Form.Item>
            </Col>
            <Col span={6} className={"action"}>
                {(() => {
                    return (
                        <Button.Group>
                            {actions.map(action => {
                                const {text, ...rest} = action;
                                const executor = Op.actions[rest.key];
                                if (Ux.isFunction(executor)) {
                                    rest.onClick = executor(reference);
                                }
                                const {$role} = reference.state;
                                rest.disabled = undefined === $role;
                                return (
                                    <Button {...rest}>
                                        {text}
                                    </Button>
                                )
                            })}
                        </Button.Group>
                    )
                })()}
            </Col>
            <Col span={10}/>
        </Row>
    )
}