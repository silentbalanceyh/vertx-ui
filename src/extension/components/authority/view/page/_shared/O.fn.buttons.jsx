import {Button, Col, Row} from "antd";
import React from "react";

export default (reference, disabled = false) => {
    const {$button = [], $submitting = false} = reference.state;
    return (
        <Row className={"page-op"}>
            <Col span={24}>
                {$button.map(op => {
                    const {text, ...rest} = op;
                    return (
                        <Button {...rest}
                                loading={$submitting}
                                disabled={disabled}>
                            {text}
                        </Button>
                    )
                })}
            </Col>
        </Row>
    )
}