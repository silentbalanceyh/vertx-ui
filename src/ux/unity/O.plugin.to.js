import Abs from '../abyss';
import U from 'underscore';

/**
 * ## 特殊函数「Zero」
 *
 * 将两个form的配置进行合并的专用操作，主要合并项：
 *
 * 1. ui：两个表单直接连接。
 * 2. hidden：两个表单的隐藏字段连接。
 * 3. initial：初始值二者合并。
 * 4. mapping：映射值二者合并。
 *
 * @memberOf module:_to
 * @param {Object} staticForm 静态表单配置。
 * @param {Object} dynamicForm 动态表单配置。
 * @return {Object} 返回最终的表单配置。
 */
const toForm = (staticForm = {}, dynamicForm = {}) => {
    /*
     * form：输入的 form
     * dynamicForm：动态输入的 form
     * 1）执行 ui 的合并
     * 2）执行 hidden 的合并
     * 3）执行 initial 的合并
     * 4）执行 op 的合并
     * 5）执行 mapping 的合并
     */
    // 先执行拷贝
    const form = staticForm ? Abs.clone(staticForm) : {};
    /*
     * 动态中的属性优先
     */
    const {ui = [], hidden = [], initial = {}, mapping = {}, ...rest} = dynamicForm;
    if (!Abs.isEmpty(rest)) {
        Object.assign(form, rest);
    }
    /*
     * 合并 ui 项
     */
    if (U.isArray(ui) && 0 < ui.length) {
        if (!form.ui) form.ui = [];
        form.ui = [].concat(form.ui, ui);
    }
    if (U.isArray(hidden) && 0 < hidden.length) {
        if (!form.hidden) form.hidden = [];      // 防止原生未配置
        form.hidden = [].concat(form.hidden, hidden);
    }
    /*
     * mapping 和 initial
     */
    if (!Abs.isEmpty(initial)) {
        if (!form.initial) form.initial = {};
        Object.assign(form.initial, initial);
    }
    if (!Abs.isEmpty(mapping)) {
        if (!form.mapping) form.mapping = {};
        Object.assign(form.mapping, mapping);
    }
    return form;
};

export default {
    toForm,
}