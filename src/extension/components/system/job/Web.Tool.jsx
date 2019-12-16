import {Col, Input, Row} from 'antd';
import React from 'react';
import Ux from 'ux';
import Event from './event';

export default (reference) => {
    let tool = Ux.fromHoc(reference, "tool");
    if (!tool) tool = {};
    const {frequency, search} = tool;
    const {$durationValue} = reference.state;
    return (
        <Row className={"job-tool"}>
            <Col span={5}>
                {frequency ? (
                    <Input addonBefore={frequency.label} suffix={frequency.unit}
                           value={String($durationValue)}
                           onChange={Event.rxDurationChange(reference)}
                           onBlur={Event.rxDuration(reference)}/>
                ) : false}
            </Col>
            <Col span={5} offset={1}>
                {search ? (
                    <Input.Search placeholder={search.placeholder} allowClear
                                  onChange={event => {
                                      const text = event.target.value;
                                      if (!text) {
                                          Event.rxSearch(reference)(text);
                                      }
                                  }}
                                  onSearch={Event.rxSearch(reference)}/>
                ) : false}
            </Col>
        </Row>
    )
}