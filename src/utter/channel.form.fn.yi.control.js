import Ux from 'ux';

const yiPartForm = (ref, config = {}, inherit = true) => {
    /*
    * segment
    * 1) direct = false
    * -- 表示当前为自定义控件，不执行 Ant-Form 的直接绑定
    * 2）direct = true
    * -- 表示当前为非自定义控件，执行 Ant-Form 的直接绑定（标准表单）
    * */
    const form = Ux.fromHoc(ref, "form");
    let reference;
    if (inherit) {
        /*
         * Form 直接从父类继承，绑定到 Ant-Form 中的 form 变量里
         * 这种情况下会包含 onChange 的 native 方法
         */
        reference = Ux.onReference(ref, 1);
    } else {
        /*
         * Form 不继承父类信息，位于自定义控件内部，不绑定到 Ant-Form 中的 form 变量
         * 这种情况下会执行外部的 onChange（自定义组件内部专用）
         */
        reference = ref;
    }
    const {renders = {}, onChange = {}, ...rest} = config;
    const raft = Ux.configForm(form, {
        reference,
        ...rest,
        renders,
    })
    const state = {};
    if (!Ux.isEmpty(onChange)) {
        state.$onChange = onChange;
    }
    state.$form = raft;
    /* 传入状态 */
    const inputState = config.state;
    if (inputState) {
        Object.assign(state, inputState);
    }
    return Ux.promise(state);
}
export default {
    yiPartForm,
}