import Ex from "ex";
import Op from "../Op.Event";
import Ux from "ux";

export default (reference, item = {}) => {
    const formAttrs = Ex.yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = Op.rxClose(reference, item, false);
    /*
     * 设置 state -> $dirty
     */
    formAttrs.doDirty = Ex.rxDirty(reference);
    formAttrs.doSubmitting = Ex.rxSubmitting(reference);
    formAttrs.$mode = Ux.Env.FORM_MODE.EDIT;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}} = reference.state;
    if (options[Ex.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[Ex.Opt.IDENTIFIER];
    }
    /*
     * 设置表单初始值
     */
    const {$inited = {}} = reference.state;
    formAttrs.$inited = $inited;
    formAttrs.$plugins = plugins;
    /*
     * 设置基础查询条件
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    return formAttrs;
}