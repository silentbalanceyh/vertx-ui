import {Button, Col, Row, Tooltip} from "antd";
import React from "react";

const renderBar = (reference) => {
    const {$combine = {}} = reference.state;
    const {toolbar = {}} = $combine;
    return (
        <Row>
            <Col span={5} offset={1}>
                {(() => {
                    const {plus = {}} = toolbar;
                    const {tooltip, ...rest} = plus;
                    return (
                        <Tooltip title={tooltip}>
                            <Button {...rest}/>
                        </Tooltip>
                    )
                })()}
            </Col>
            <Col span={18}>

            </Col>
        </Row>
    )
}

export default {
    renderBar,
}