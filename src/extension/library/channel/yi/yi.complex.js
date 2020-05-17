import Ux from "ux";

export default (ref, config = {}, direct = true) => {
    /*
    * segment
    * 1) direct = false
    * -- 表示当前为自定义控件，不执行 Ant-Form 的直接绑定
    * 2）direct = true
    * -- 表示当前为非自定义控件，执行 Ant-Form 的直接绑定（标准表单）
    * */
    const form = Ux.fromHoc(ref, "form");
    let reference;
    if (direct) {
        reference = Ux.onReference(ref, 1);
    } else {
        reference = ref;
    }
    const raft = Ux.configForm(form, {
        reference,
        ...config
    })
    const state = {};
    state.$form = raft;
    state.$ready = true;
    ref.setState(state);
}