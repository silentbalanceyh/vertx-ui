import Ut from '../../../unity';
import {Col, Input} from 'antd';
import React from 'react';

const jsxTitle = (item = {}) => {
    const key = item.key ? item.key : Ut.randomString(16);
    return (
        <Col className={item.className ? item.className : "ux-title"}
             key={key} span={item.span ? item.span : 24}>
            {/** 只渲染Title **/}
            {item.title}
        </Col>
    );
};
const jsxGrid = (item = {}) => (
    <Col className={item.className ? item.className : "ux-title"}
         key={item.field} span={item.span ? item.span : 24}
         style={item.style ? item.style : {}}>
        {/** 只渲染Title **/}
        {item.grid.map(each => (
            <Col span={each.span} key={Ut.randomString(12)}
                 style={each.style ? each.style : {}}>
                &nbsp;&nbsp;&nbsp;&nbsp;{each.text}&nbsp;&nbsp;&nbsp;&nbsp;
            </Col>
        ))}
    </Col>
);
const jsxHidden = (reference, name, initialValue) => {
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return getFieldDecorator(name, {
        initialValue
    })(<Input key={name} type={"hidden"}/>);
};
export default {
    jsxTitle,
    jsxGrid,
    jsxHidden
}