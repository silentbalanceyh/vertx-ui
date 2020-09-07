import React from 'react';
import './Cab.less';
import renderItem from "./Web.Each";
import Ux from "ux";
import {Button} from "antd";

export default {
    "BUTTON": (reference, config = [], attributes = {}) =>
        1 < config.length ?
            (
                <Button.Group className={"ex-action-group"}>
                    {/* 多个按钮，使用 Button.Group */}
                    {config.map(each => renderItem(reference, each, Ux.clone(attributes)))}
                </Button.Group>
            ) :
            /* 单个按钮不使用 Button.Group */
            renderItem(reference, config[0], Ux.clone(attributes)),
    "LINK": (reference, config = [], attributes = {}) => (
        <ul className={"ex-link"}>
            {/* 链接直接操作 */}
            {config.map(each => renderItem(reference, each, Ux.clone(attributes)))}
        </ul>
    )
}