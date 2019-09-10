import React from 'react';
import Yo from '../yo';

export default (reference, item = {}) => {
    const {$form = {}} = reference.props;
    /*
     * 表单提取
     */
    const {FormAdd} = $form;
    if (FormAdd) {
        /*
         * 添加表单处理，设置添加表单相关信息
         */
        const formAttrs = Yo.yoFormAdd(reference, item);
        
        return (<FormAdd {...formAttrs}/>)
    } else {
        console.error("`FormAdd`表单组件未设置，无任何界面呈现！");
        return false;
    }
}