import React from 'react';
import {LoadingAlert} from 'web';
import {ExDrawerRelation} from "ei";
import {Col, Row, Tag} from 'antd';

export default (reference, title = {}) => {
    const {$selected, $models = []} = reference.state;
    if ($selected) {
        const header = title.header;
        const data = $selected.data ? $selected.data : {};
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
                        <ExDrawerRelation $items={$models}/>
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (<LoadingAlert $alert={title.right}/>)
    }
}