import {Button, Col, Row} from "antd";
import React from "react";

export default (reference, disabled = false, hidden = false) => {
    const {$button = [], $submitting = false} = reference.state;
    const attrs = {};
    if (hidden) {
        attrs.className = "page-op ux-hidden";
    } else {
        attrs.className = "page-op";
    }
    return (
        <Row {...attrs}>
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