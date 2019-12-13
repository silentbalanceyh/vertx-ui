import {Col, DatePicker, Row} from "antd";
import React from 'react';
import Op from './Op';

const renderFull = (reference, value, jsx = {}) => {
    const {config = {}} = reference.props;
    let {placeholder} = config;
    if ("string" === typeof placeholder) {
        placeholder = placeholder.split(',')
    }
    const [startHint, endHint] = placeholder;
    return (
        <Row>
            <Col span={11}>
                <DatePicker className={"ux-readonly"}
                            placeholder={startHint}
                            value={value.start}
                            format={config.format}
                            onChange={Op.onStart(reference)}
                            style={{width: "100%"}}
                            {...jsx}/>
            </Col>
            <Col span={2} style={{
                paddingTop: 4
            }}>
                &nbsp;&nbsp;～&nbsp;&nbsp;
            </Col>
            <Col span={11}>
                <DatePicker className={"ux-readonly"}
                            placeholder={endHint}
                            value={value.end}
                            format={config.format}
                            onChange={Op.onEnd(reference)}
                            style={{width: "100%"}}
                            {...jsx}/>
            </Col>
        </Row>
    )
};

export default (reference, mode, value = {}) => {
    if ("FULL" === mode) {
        return renderFull(reference, value, {showTime: true});
    } else if ("DATE" === mode) {
        return renderFull(reference, value, {});
    } else if ("MONTH" === mode) {
        return renderFull(reference, value, {mode});
    } else if ("TIME" === mode) {

        return (<span>需要时再开发</span>)
    }
}