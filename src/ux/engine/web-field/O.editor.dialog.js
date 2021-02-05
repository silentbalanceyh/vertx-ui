import {DialogEditor} from 'web';
import React from 'react';

const aiDialogEditor = (reference, jsx = {}) => {
    /*
     * 表格中的行执行器
     */
    const {
        $rows = {},
        $plugins = {},
    } = reference.props;
    /*
     * 特殊函数执行
     * $plugins -> 只有 DialogEditor 才会使用该函数，执行
     * 核心过滤，判定 EXECUTOR 部分
     */
    const inherit = jsx;
    inherit.reference = reference;
    inherit.$rows = $rows;
    /*
     * 构造新的逻辑流程
     */
    inherit.$plugins = $plugins;
    return (<DialogEditor {...inherit}/>)
};

export default {
    aiDialogEditor
}