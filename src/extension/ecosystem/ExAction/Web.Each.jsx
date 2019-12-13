import Op from "./Op";
import ExButton from "../ExButton/UI";
import ExDialog from "../ExDialog/UI";
import React from "react";
import Ex from 'ex';
import Ux from 'ux';

export default (reference, config = {}, attributes = {}) => {
    const type = Op.getType(config);
    config = Ux.clone(config);  // 拷贝以保证 ExAction 和 ExDialog 每次都刷新

    return "NONE" === type ?
        (<ExButton {...attributes} key={config.key}
                   config={config}/>) :
        (<ExDialog {...attributes} key={config.key}
            // 第二参 reference 需要传入，负责隐藏界面
                   config={Ex.configDialog(config)}/>);
};