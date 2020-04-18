import {Button, Checkbox, Col, Input, Row} from 'antd';
import React from 'react';
import Ux from 'ux';
import Event from '../event';

const renderSearch = (reference, tool = {}) => {
    const {search} = tool;
    if (search) {
        return (
            <Input.Search placeholder={search.placeholder} allowClear
                          onChange={event => {
                              const text = event.target.value;
                              if (!text) {
                                  Event.rxSearch(reference)(text);
                              }
                          }}
                          onSearch={Event.rxSearch(reference)}/>
        )
    } else return false;
}
// eslint-disable-next-line
const renderDuration = (reference, tool = {}) => {
    const {frequency} = tool;
    const {$durationValue} = reference.state;
    if (frequency) {
        return (
            <Input addonBefore={frequency.label} suffix={frequency.unit}
                   value={$durationValue}
                   onChange={Event.rxDurationChange(reference)}
                   onBlur={Event.rxDurationBlur(reference)}
                   onFocus={Event.rxDurationFocus(reference)}/>
        )
    } else return false;
}

const renderButton = (reference, tool = {}) => {
    const {button = {}} = tool;
    const {$searchPrefix, $loading = false} = reference.state;
    return (
        <Button.Group>
            <Button icon={"redo"}
                    className={"ux-red"}
                    loading={$loading}
                    onClick={Event.rxRefresh(reference)}>
                {button.refresh}
            </Button>
            <Button icon={"filter"}
                    loading={$loading}
                    disabled={!$searchPrefix}
                    onClick={Event.rxFilterClean(reference)}>
                {button.clean}
            </Button>
        </Button.Group>
    )
}

const renderChecked = (reference, tool = {}) => {
    const {checked = {}} = tool;
    return (
        <Checkbox.Group onChange={Event.rxChecked(reference)}>
            {Object.keys(checked).map(key => {
                const text = checked[key];
                return (
                    <Checkbox value={key} key={key} children={text}/>
                )
            })}
        </Checkbox.Group>
    )
}

export default (reference) => {
    let tool = Ux.fromHoc(reference, "tool");
    if (!tool) tool = {};
    return (
        <Row className={"job-tool"}>
            <Col span={4}>
                {renderButton(reference, tool)}
            </Col>
            <Col span={6} className={"check-group"}>
                {renderChecked(reference, tool)}
            </Col>
            <Col span={5} offset={9}>
                {renderSearch(reference, tool)}
            </Col>
        </Row>
    )
}