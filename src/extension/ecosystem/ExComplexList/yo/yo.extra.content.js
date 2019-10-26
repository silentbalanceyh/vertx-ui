import Ex from 'ex';
import Opt from '../options';

const {Order} = Opt;

const isSatisfy = (reference, view = Ex.Mode.LIST) => {
    const {options = {}} = reference.state;
    if (Ex.Mode.LIST !== view) {
        /*
         * 如果是添加
         */
        if (Ex.Mode.ADD === view) {
            if (options.hasOwnProperty(Ex.Opt.TABS_EXTRA_ADD)) {
                return !!options[Ex.Opt.TABS_EXTRA_ADD];
            } else return true;  // 不设置直接 true
        } else if (Ex.Mode.EDIT === view) {
            if (options.hasOwnProperty(Ex.Opt.TABS_EXTRA_EDIT)) {
                return !!options[Ex.Opt.TABS_EXTRA_EDIT];
            } else return true;  // 不设置直接 true
        } else return false; // 否则 false
    } else return false; // 否则 false
};
export default (reference, tabs = {}) => {

    /*
     * 提交状态
     * state -> $submitting
     * state -> view
     */
    const {$submitting = false, $view = Ex.Mode.LIST} = reference.state;
    if (isSatisfy(reference, $view)) {
        /*
         * 1.添加流程
         * 2.编辑流程
         * 双流程单独处理
         */
        const prefix = Ex.Mode.ADD === $view ? "op.add" : "op.edit";
        /*
         * 特殊配置
         * 1）tab.extra.add
         * 2）tab.extra.edit
         */
        const attrs = Ex.yoAction(reference, prefix, Order);
        attrs.$submitting = $submitting;
        attrs.$activeKey = tabs.activeKey;
        attrs.$view = $view;
        /* 核心参数传入 ExAction */
        attrs.doSubmitting = Ex.rxSubmitting(reference);
        // attrs.fnSubmitting = Ex.generate(reference).submitting;
        return attrs;
    }
}