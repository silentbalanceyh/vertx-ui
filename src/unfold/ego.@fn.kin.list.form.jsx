import __Zn from './zero.module.dependency';
import React from "react";

/**
 * ## 「标准」`Ex.kinForm`
 *
 * @method kinForm
 * @memberOf module:kin/unfold
 * @param reference
 * @param item
 * @param isAdd
 * @return {*}
 */
export default (reference, item = {}, isAdd = false) => {
    const {$form = {}} = reference.props;
    /*
     * 表单提取
     */
    const {
        FormAdd,
        FormEdit,
    } = $form;
    if (isAdd) {
        if (!FormAdd) {
            console.error("`FormAdd`表单组件未设置，无任何界面呈现！");
            return false;
        }
        const formAttrs = __Zn.yoFormAdd(reference, item);
        return (<FormAdd {...formAttrs}/>)
    } else {
        if (!FormEdit) {
            console.error("`FormEdit`表单组件未设置，无任何界面呈现！");
            return false;
        }
        const formAttrs = __Zn.yoFormEdit(reference, item);
        return (<FormEdit {...formAttrs}/>)
    }
}