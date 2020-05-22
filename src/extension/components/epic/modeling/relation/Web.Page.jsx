import React from 'react';
import {ExGraphicSpider} from "ei";
import {Col, Row, Tag} from 'antd';
import Ex from 'ex';
import {ModelingPpt} from 'app';

export default (reference, title = {}) => {
    const {$selected} = reference.state;
    if ($selected) {
        const header = title.header;
        const data = $selected.data ? $selected.data : {};
        const inherit = Ex.yoAmbient(reference);
        return (
            <div>
                <Row className={"header"}>
                    <Col span={4} className={"title"}>
                        {header.name}
                    </Col>
                    <Col span={6} offset={1}>
                        <Tag color={"cyan"} style={{
                            fontSize: 14,
                        }}>{data.name}</Tag>
                    </Col>
                    <Col span={4} className={"title"}>
                        {header.identifier}
                    </Col>
                    <Col span={6} offset={1}>
                        {data.identifier}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <ExGraphicSpider {...inherit} $current={data}/>
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (<ModelingPpt alert={title.right} adjust={460} step={1}/>)
    }
}