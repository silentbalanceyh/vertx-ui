import React from 'react';
import {Modal} from 'antd';
import RxAnt from './AI.RxAnt'
import RxInput from './AI.Input.Ant';
import RxInput2 from './AI.Input.Ant2';
import RxDatum from './AI.Input.Datum';

const aiConfirm = (reference, onOk, ...path) => {
    // 构造窗口配置
    const config = RxAnt.toDialogConfig.apply(null,
        [reference].concat(path));
    Modal.confirm({...config, onOk});
};
const aiUI = (Component) => {
    return (reference, jsx = {}) => (
        <Component reference={reference} {...jsx}/>
    )
};
export default {
    // 纯写法
    aiUI,
    // 对话框专用
    aiConfirm,
    // 直接组件
    ...RxInput,
    // 绑定组件专用
    ...RxDatum,

    ...RxInput2,
}