import React from 'react';
import Yo from '../yo';

export default (reference, item = {}) => {
    const {$form = {}} = reference.props;
    /*
     * 表单提取
     */
    const {FormEdit} = $form;
    if (FormEdit) {
        /*
         * 添加表单处理，设置添加表单相关信息
         */
        const formAttrs = Yo.yoFormEdit(reference, item);
        return (<FormEdit {...formAttrs}/>)
    } else {
        console.error("`FormEdit`表单组件未设置，无任何界面呈现！");
        return false;
    }
}