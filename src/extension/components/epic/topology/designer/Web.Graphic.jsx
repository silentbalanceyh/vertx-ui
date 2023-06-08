import Ex from "ex";
import Ux from 'ux';
import React from "react";
import {ExGraphicEditor} from "ei";
import Op from './op';

export default (reference) => {
    const inherit = Ex.yoAmbient(reference);
    const {
        $current = {}
    } = reference.state;
    // 基本配置
    inherit.config = Ux.fromHoc(reference, "graphic");
    inherit.data = $current;        // 模型基础信息
    // 配置程序
    const gxFun = Op.rxCommand(reference);
    return (
        <ExGraphicEditor {...inherit} {...gxFun}/>
    );
}