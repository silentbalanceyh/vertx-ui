import React from 'react';
import {Modal} from 'antd';
import RxAnt from '../ant/AI.RxAnt';
import RxDatum from './AI.Input.Datum';

import Input from './AI.Input.Ant';
import Input2 from './AI.Input.Ant2';
import Defined from './AI.Input.Defined';
import Op from './AI.Input.Op';

const aiConfirm = (reference, onOk, ...path) => {
    // 构造窗口配置
    const config = RxAnt.toDialogConfig.apply(null,
        [reference].concat(path));
    Modal.confirm({...config, onOk});
};
const aiUI = (Component, viewOnly = false) => {
    return (reference, jsx = {}) => (
        <Component reference={reference} {...jsx} viewOnly={viewOnly}/>
    )
};
export default {
    // 纯写法
    aiUI,
    // 对话框专用
    aiConfirm,
    // 直接组件
    ...Input,
    ...Input2,
    ...Defined,
    ...Op,
    // 绑定组件专用
    ...RxDatum,
}