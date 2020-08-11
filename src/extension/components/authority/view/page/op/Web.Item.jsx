import React from 'react';
import {Checkbox, Col, Icon, List, Row} from 'antd';
import Op from './Op';

export default (reference, source = [], values) => {
    const valueSet = new Set(values);
    return (
        <Row className={"row-action"}>
            <List dataSource={source} renderItem={item => {
                const {icon} = item;
                return (
                    <Col span={8}>
                        <Checkbox checked={valueSet.has(item.key)}
                                  onChange={Op.rxCheck(reference, item)}/>
                        &nbsp;&nbsp;
                        {item.alias}
                        {icon ? (<Icon {...icon}/>) : false}
                    </Col>
                )
            }}/>
        </Row>
    )
}