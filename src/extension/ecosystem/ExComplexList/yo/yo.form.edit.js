import Ex from "ex";
import Op from "../Op.Event";

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
    /*
     * 设置表单初始值
     */
    const {$inited = {}} = reference.state;
    formAttrs.$inited = $inited;
    /*
     * 设置基础查询条件
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    return formAttrs;
}