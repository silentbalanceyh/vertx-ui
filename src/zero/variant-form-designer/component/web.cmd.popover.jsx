import Cmd from "../command";
import {Popover} from "antd";
import React from "react";
import __Zn from '../zero.uca.dependency';

export default (reference, inputConfig = {}, children) => {
    const {item = {}, config = {}} = inputConfig;
    const {$popover} = reference.state;
    /* 二选一的处理 */
    const visible = $popover ? $popover === item.key : false;
    const fnContent = Cmd.Command[item.key];
    const popoverStyle = Cmd.CommandStyle[item.key];
    /* 窗口分离 */
    const {popover = {}} = config;
    const popoverAttrs = popover[item.key] ? popover[item.key] : {};
    return (
        <Popover open={visible} trigger={"click"} key={item.key}
                 overlayClassName={"web-form-designer-popover"}
                 overlayStyle={popoverStyle ? popoverStyle : {}}
                 content={__Zn.isFunction(fnContent) ? fnContent(reference) : false}
                 placement={"bottomLeft"} {...popoverAttrs}>
            {children}
        </Popover>
    )
}