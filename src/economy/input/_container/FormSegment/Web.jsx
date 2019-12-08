import Ux from 'ux';
import React from 'react';

const renderForm = (reference) => {
    const {$component: Component} = reference.state;
    const ref = Ux.onReference(reference, 1);
    /*
     * 这里需要一个条件触发 Re-Render 的动作，目前能够满足条件的只有
     * ref 中 form 的值发生改变（Ant-Design Form值变更）
     * const {form} = ref.props;
     * const values = form.getFieldsValue();
     */
    const {form} = ref.props;
    const values = form.getFieldsValue();
    const {$inited = {}} = reference.props;
    return (
        <Component $inited={$inited} $updater={values}
                   reference={ref}/>
    );
};

const RENDERS = {
    FORM: renderForm,
};

export default (reference) => {
    const {$source} = reference.state;
    const fnRender = RENDERS[$source];
    if (Ux.isFunction(fnRender)) {
        return fnRender(reference);
    } else return false;
}