import React from 'react';
import Ux from "ux";
import {Button} from "antd";
import ExButton from "../ExButton/UI";
import ExDialog from "../ExDialog/UI";
import __Zn from '../zero.aero.dependency';

const getType = (item = {}) => {
    let dialogType = "NONE";
    if (item.component) {
        const {type = "NONE"} = item.component;
        dialogType = type;
    }
    return dialogType;
};

const renderItem = (reference, config = {}, attributes = {}) => {
    const type = getType(config);
    config = Ux.clone(config);  // 拷贝以保证 ExAction 和 ExDialog 每次都刷新
    attributes = Ux.sorterObject(attributes);   // 按顺序打印属性信息
    const {visible = true} = config;
    return visible ? (
        "NONE" === type ?
            (<ExButton {...attributes} key={config.key}
                       config={config}/>) :
            (<ExDialog {...attributes} key={config.key}
                // 第二参 reference 需要传入，负责隐藏界面
                       config={__Zn.configDialog(config)}/>)
    ) : false
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    "BUTTON": (reference, config = [], attributes = {}) =>
        1 < config.length ?
            (
                <Button.Group>
                    {/* 多个按钮，使用 Button.Group */}
                    {config.map(each => renderItem(reference, each, Ux.clone(attributes)))}
                </Button.Group>
            ) :
            /* 单个按钮不使用 Button.Group */
            renderItem(reference, config[0], Ux.clone(attributes)),
    "LINK": (reference, config = [], attributes = {}) => (
        <ul className={"ux_op_ul"}>
            {/* 链接直接操作 */}
            {config.map(each => renderItem(reference, each, Ux.clone(attributes)))}
        </ul>
    )
}