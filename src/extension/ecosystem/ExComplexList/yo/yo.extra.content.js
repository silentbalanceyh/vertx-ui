import Ex from 'ex';
import Opt from '../options';

const {Order} = Opt;
export default (reference, tabs = {}) => {

    /*
     * 提交状态
     * state -> $submitting
     * state -> view
     */
    const {$submitting = false, $view = Ex.Mode.LIST} = Ex.state(reference);
    if (Ex.Mode.LIST !== $view) {
        const prefix = Ex.Mode.ADD === $view ? "op.add" : "op.edit";
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