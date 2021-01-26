import Ux from 'ux';
import {Fn, Order} from './I.list.options';
import yoAction from '../yo.action';

const isSatisfy = (reference, view = Fn.Mode.LIST) => {
    const {options = {}} = reference.state;
    if (Fn.Mode.LIST !== view) {
        /*
         * 如果是添加
         */
        if (Fn.Mode.ADD === view) {
            if (options.hasOwnProperty(Fn.Opt.TABS_EXTRA_ADD)) {
                return !!options[Fn.Opt.TABS_EXTRA_ADD];
            } else return true;  // 不设置直接 true
        } else if (Fn.Mode.EDIT === view) {
            if (options.hasOwnProperty(Fn.Opt.TABS_EXTRA_EDIT)) {
                return !!options[Fn.Opt.TABS_EXTRA_EDIT];
            } else return true;  // 不设置直接 true
        } else return false; // 否则 false
    } else return false; // 否则 false
};
const isOk = (item = {}) => {
    const $category = Ux.immutable([
        "op.submit.save",
        "op.submit.delete",
        "op.submit.reset"
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
    const {$submitting = false, $view = Fn.Mode.LIST} = reference.state;
    if (isSatisfy(reference, $view)) {
        /*
         * 1.添加流程
         * 2.编辑流程
         * 双流程单独处理
         */
        const prefix = Fn.Mode.ADD === $view ? "op.add" : "op.edit";
        /*
         * 特殊配置
         * 1）tab.extra.add
         * 2）tab.extra.edit
         */
        const attrs = yoAction(reference, prefix, Order);
        /*
         * 编辑界面核心操作
         */
        if (Fn.Mode.EDIT === $view) {
            /*
             * 设置可编辑的基础关系
             */
            setEdition(attrs, reference);
            /* 处理 config */
            if (attrs.config && 1 === attrs.config.length) {
                /*
                 * 单 reset 不呈现
                 * 此种情况只有一个 RESET 按钮，直接过滤掉
                 ***/
                attrs.config = attrs.config
                    .filter(item => "op.submit.reset" !== item.category);
            }
        }
        attrs.$submitting = $submitting;
        attrs.$activeKey = tabs.activeKey;
        attrs.$view = $view;
        /* 核心参数传入 ExAction */
        attrs.doSubmitting = Fn.rxSubmitting(reference);
        // attrs.fnSubmitting = Fn.generate(reference).submitting;
        return Ux.sorterObject(attrs);
    }
}