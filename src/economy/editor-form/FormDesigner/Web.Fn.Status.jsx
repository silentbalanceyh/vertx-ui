import Ux from 'ux';
import {Col, Icon, Row, Tag} from 'antd';
import React from "react";

export default (reference) => {
    const status = Ux.fromHoc(reference, "status");
    const {raft = {}} = reference.state;
    return (
        <Row className={"content-status"}>
            <Col span={4}>
                <Tag color={"volcano"} style={{fontSize: 14}}>
                    {status.set}
                    &nbsp;
                    <Icon type={"arrow-right"}/>
                </Tag>
            </Col>
            <Col span={5}>
                <label>{status.hidden}</label>
                &nbsp;&nbsp;
                {(() => {
                    const {form = {}} = raft;
                    let counter;
                    if (form.hidden) {
                        counter = form.hidden.length;
                    } else {
                        counter = 0;
                    }
                    return (
                        <Tag>
                            {Ux.formatExpr(status.count, {counter}, true)}
                        </Tag>
                    )
                })()}
            </Col>
            <Col span={5}>
                <label>{status.initial}</label>
                &nbsp;&nbsp;
                {(() => {
                    const {form = {}} = raft;
                    let counter;
                    if (form.initial) {
                        counter = Object.keys(form.initial).length;
                    } else {
                        counter = 0;
                    }
                    return (
                        <Tag>
                            {Ux.formatExpr(status.count, {counter}, true)}
                        </Tag>
                    )
                })()}
            </Col>
            <Col span={5}>
                <label>{status.assist}</label>
                &nbsp;&nbsp;
                {(() => {
                    const {form = {}} = raft;
                    let counter;
                    if (form.assist) {
                        counter = Object.keys(form.assist).length;
                    } else {
                        counter = 0;
                    }
                    return (
                        <Tag>
                            {Ux.formatExpr(status.count, {counter}, true)}
                        </Tag>
                    )
                })()}
            </Col>
        </Row>
    )
}