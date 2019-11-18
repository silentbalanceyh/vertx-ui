import Abs from '../abyss';
import U from 'underscore';
/*
 * 重写 form 的合并规则
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