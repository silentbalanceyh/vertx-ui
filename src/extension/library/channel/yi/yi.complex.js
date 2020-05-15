import Ux from "ux";

export default (reference) => {
    const config = Ux.fromHoc(reference, "tabs");
    const state = {};
    state.$tabs = Ux.configTab(reference, config);
    state.$ready = true;
    {
        /* 第一页 / 第二页编辑表单专用 */
        const form = Ux.fromHoc(reference, "form");
        /* 注入 key, name 名称 */
        Object.keys(form).forEach(key => form[key].name = key);
        state.$form = form;
    }
    reference.setState(state);
}