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
    const {grid = [11, 2, 11], style = {}} = config;
    const [left, middle, right] = grid;
    const leftStyle = style.left ? style.left : {};
    const rightStyle = style.right ? style.right : {}
    return (
        <Row>
            <Col span={left}>
                <DatePicker className={"ux_readonly"}
                            placeholder={startHint}
                            value={value.start}
                            format={config.format}
                            onChange={Op.onStart(reference)}
                            style={leftStyle}
                            {...jsx}/>
            </Col>
            <Col span={middle} style={{
                paddingTop: 4
            }}>
                &nbsp;&nbsp;～&nbsp;&nbsp;
            </Col>
            <Col span={right}>
                <DatePicker className={"ux_readonly"}
                            placeholder={endHint}
                            value={value.end}
                            format={config.format}
                            onChange={Op.onEnd(reference)}
                            style={rightStyle}
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