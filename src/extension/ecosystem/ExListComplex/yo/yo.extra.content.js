import Ex from 'ex';
import Ux from 'ux';
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
const isOk = (item = {}) => {
    const $category = Ux.immutable([
        "op.submit.save", "op.submit.delete", "op.submit.reset"
    ]);
    return $category.contains(item.category)
};
const setEdition = (attrs = {}, reference) => {
    const {$inited = {}} = reference.state;
    const {metadata} = $inited;
    if (!Ux.isEmpty(metadata)) {
        const {plugins} = reference.state;
        const executor = plugins && Ux.isFunction(plugins.pluginRow) ?
            plugins.pluginRow : () => null;
        const result = executor($inited, reference);
        attrs.config.filter(isOk).forEach(item => {
            /*
             * 是否可编辑
             */
            if ("op.submit.delete" === item.category) {
                item.visible = !!result.deletion;
            }
            if ("op.submit.save" === item.category) {
                item.visible = !!result.edition;
            }
            if ("op.submit.reset" === item.category) {
                item.visible = !!result.edition || !!result.deletion;
            }
        })
    }
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
        /*
         * 编辑界面核心操作
         */
        if (Ex.Mode.EDIT === $view) {
            setEdition(attrs, reference);

            /* 处理 config */
            if (attrs.config && 1 === attrs.config.length) {
                /* 单 reset 不呈现 */
                attrs.config = attrs.config
                    .filter(item => "op.submit.reset" !== item.category);
            }
        }
        attrs.$submitting = $submitting;
        attrs.$activeKey = tabs.activeKey;
        attrs.$view = $view;
        /* 核心参数传入 ExAction */
        attrs.doSubmitting = Ex.rxSubmitting(reference);
        // attrs.fnSubmitting = Ex.generate(reference).submitting;
        return Ux.sorterObject(attrs);
    }
}