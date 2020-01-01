/*
* ExForm 配置转换处理
* 1. 静态 _form -> 最终的 raft
* 2. 动态 magic, control -> 最终的 raft
* 实际上是 Ox 中的 normalize 方法
* */
import Ux from "ux";
import yoAmbient from './yo.ambient';
import yoFormPlugin from './yo.form.plugin';

const _cabData = (reference, addOn = {}) => {
    if (!addOn) addOn = {};
    let {dialog, modal, form} = addOn;
    if (!dialog) {
        dialog = Ux.fromHoc(reference, "dialog");
    }
    if (!modal) {
        modal = Ux.fromHoc(reference, "modal");
    }
    const assist = Ux.fromHoc(reference, "assist");
    const state = {dialog, modal, form};
    if (assist) {
        state.assist = Ux.clone(assist);
    }
    return state;
};
export default (reference, additional = {}, data = {}) => {
    const addOn = _cabData(reference, additional);
    const attrs = yoAmbient(reference);
    const config = {};
    config.form = yoFormPlugin(addOn, reference);
    if (addOn.assist) {
        config.assist = addOn.assist;
    }
    /*
    if (U.isObject(addOn.form)) {
        let form = addOn.form;
        const {$options} = reference.props;
        if ($options && $options.form) {
            form = Ux.toForm(form, $options.form);
        }
        config.form = form;
    }
    */
    /*
     * `magic`：特殊参数
     * `addon`：特殊配置
     * `control`：和后端的 UI_CONTROL 对应
     */
    if (addOn.hasOwnProperty('control')) {
        config.magic = Ux.clone(addOn.magic);
        config.control = addOn.control;
        config.addon = Ux.clone(addOn.addon);
    }
    /*
     * Dialog 窗口配置
     */
    if (addOn.dialog) {
        config.dialog = {
            title: Ux.clone(addOn.dialog),
            modal: addOn.modal,
        }
    }
    attrs.config = Ux.clone(config);
    /* Form 特殊配置 */
    attrs.$inited = Ux.clone(data);
    /* Add表单专用 */
    const {$addKey, $mode, $identifier} = reference.props;
    if ($addKey) {
        /* 客户端提供主键 */
        attrs.$addKey = $addKey;
    }
    if ($mode) {
        attrs.$mode = $mode;
    }
    /* 挂载 identifier 专用 */
    if ($identifier) {
        attrs.$identifier = $identifier;
    }
    /* 外置Form */
    return attrs;
};