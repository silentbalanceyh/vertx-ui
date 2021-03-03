import Ux from "ux";
import './Cab.less';
import React from "react";
import {Col, Row} from 'antd';
import {ExLogin} from 'ei';
import Ex from 'ex';

export default (reference, {
    title,
    links,
}) => (
    <Row>
        <Col span={2}/>
        <Col span={20} className={"ux-login-form"}>
            <Row className={"title"}>
                {title}
            </Row>
            <Row className={"form"}>
                <ExLogin {...Ex.yoAmbient(reference)}/>
            </Row>
            <Row className={"notice"}>
                {links.map(link => (
                    <div key={Ux.randomString(7)}>
                        {link.text}：
                        <a href={link.uri} target={"_blank"}
                           rel="noopener noreferrer">
                            {link.uri}
                        </a>
                    </div>
                ))}
            </Row>
        </Col>
        <Col span={2}/>
    </Row>
)