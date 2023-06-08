import __Zn from './zero.module.dependency';

import {Col} from "antd";
import React from "react";
import {LoadingAlert} from "zone";

const Cv = __Zn.Env;

const aiTitle = (reference, cell = {}) => {
    // Fix issue: render is invalid for prop
    const attrs = __Zn.clone(cell);
    if (attrs.render) {
        delete attrs.render;
    }
    const {title, ...cellRest} = attrs;
    // Fix issue: list should has `key`
    if (!cellRest.key) cellRest.key = __Zn.randomUUID();
    // 第二种格式出台
    const {config = {}} = cell;
    if (config.description) {
        return (
            <Col {...cellRest} span={24} className={"ux_comment"}>
                <LoadingAlert $alert={config}/>
            </Col>
        )
    } else if (config.tips) {
        const offset = __Zn.valueInt(config.offset, 0);
        const span = 24 - offset;
        const attrs = {offset, span};
        if (config.style) {
            attrs.style = config.style;
        }
        return (
            <Col {...attrs} key={cellRest['key']} className={"ux-tips"}>
                {title}
            </Col>
        )
    } else {
        cellRest.className = `ux_title`;
        return (
            <Col {...cellRest} span={24}>
                {title}
            </Col>
        )
    }
}
const aiSubject = (reference, cell) => {
    const {$subject = {}} = reference.props;
    const attrs = __Zn.clone(cell);
    const {subject, ...cellRest} = attrs;
    // Fix issue: list should has `key`
    if (!cellRest.key) cellRest.key = __Zn.randomUUID();
    const data = $subject[subject];
    // 属性处理
    const attrRest = {};
    attrRest.key = cell.key;
    attrRest.className = `ux_subject`;
    attrRest.span = 24;
    return (
        <Col {...attrRest}>
            <img src={Cv.V_IMAGE.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
            <div className={"ux_subject_tip"}>
                {data.subject}
                &nbsp;&nbsp;
                <div className={"ux_subject_name"}>
                    {data['nameFull']}
                </div>
            </div>
        </Col>
    )
}
const aiHidden = (reference, values = {}, raft = {}) => {
    if (raft.hidden) {
        return raft.hidden
            .filter(item => __Zn.isFunction(item.render))
            .map(each => each.render(values))
    } else return false;
};
export default {
    aiHidden,
    aiSubject,
    aiTitle,
}