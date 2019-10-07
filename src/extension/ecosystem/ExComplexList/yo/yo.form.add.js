import Ex from "ex";
import Ux from 'ux';
import Op from "../Op.Event";

export default (reference, item = {}) => {
    const formAttrs = Ex.yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = Op.rxClose(reference, item);
    /*
     * 设置 state -> $dirty 的函数
     */
    formAttrs.doDirty = Ex.rxDirty(reference);
    formAttrs.doSubmitting = Ex.rxSubmitting(reference);
    /*
     * 设置唯一的 $addKey
     * 这个值就是 Tab 中的 activeKey
     */
    formAttrs.$addKey = item.key;
    formAttrs.$mode = Ux.Env.FORM_MODE.ADD;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}} = reference.state;
    if (options[Ex.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[Ex.Opt.IDENTIFIER];
    }
    /*
     * 提供 $query 用于处理特殊条件
     * Tabular / Category
     */
    const {$query = {}, $record} = reference.props;
    formAttrs.$query = $query;
    /*
     * 添加的时候需要使用初始化的默认值
     * 所以引入外层变量 $record 来存储
     * 1）外层变量是单变量，主要用于记录拷贝
     * 2）如果是一个数组，必定会在Form中使用选择的方式，那么可以直接走 Assist
     */
    if ($record) {
        formAttrs.$record = $record;
    }
    return formAttrs;
}