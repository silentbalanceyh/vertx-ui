import {Button, Col, Form, Row} from "antd";
import React from "react";
import Norm from "../Ux.Normalize";
import DFT from "./Ux.Jsx.Default";

/**
 * 特殊方法：双高阶函数的渲染
 * @param reference
 */
const jsxOpArchor = (reference) => {
    const {$op = {}} = reference.props;
    const keys = Object.keys($op);
    const style = {display: "none"};
    return keys.map(key => (
        <Button id={key} key={key} onClick={$op[key](reference)} style={style}/>
    ))
};

/**
 * 仅渲染按钮
 * @method jsxOp
 * @param reference
 * @param column
 * @param op
 * @return {boolean}
 */
const jsxOp = (reference = {}, column = 4, op = {}) => {
    const ops = Norm.extractOp(reference, op);
    const hidden = Norm.extractHidden(reference);
    const span = 24 / column;
    const btnOpts = DFT.uiItem();
    btnOpts.label = ' ';
    btnOpts.colon = false;
    const opStyle = {};
    if (hidden.op) {
        opStyle.display = "none"
    }
    return (ops && 0 < ops.length ? (
        <Row style={opStyle}>
            <Col span={span}>
                <Form.Item {...btnOpts}>
                    {ops.map(op => <Button {...op}>{op.text}</Button>)}
                </Form.Item>
            </Col>
        </Row>
    ) : false)
};
export default {
    jsxOpArchor,
    jsxOp,
}