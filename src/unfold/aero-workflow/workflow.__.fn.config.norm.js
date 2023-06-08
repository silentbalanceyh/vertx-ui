// ======================= 配置部分 =======================
import Ux from "ux";

const configUi = ($workflow = {}, key, array = false) => {
    const {config = {}} = $workflow;
    const {ui = {}} = config;
    const configData = ui[key];
    if (configData) {
        return configData;
    } else {
        return array ? [] : {};
    }
}
const configPhase = ($workflow = {}, configRef = {}) => {
    const phase = configUi($workflow, "phase");
    const {forbidden = []} = phase;
    /*
     * items配置：[
     *      "",
     *      "",
     * ]
     * 字符串模式
     */
    let {items = []} = configRef;
    items = Ux.clone(items);
    items = items.filter(item => {
        let key;
        if ("string" === typeof item) {
            key = item.split(',')[0];
        } else {
            key = item.key;
        }
        return !forbidden.includes(key);
    });
    return items;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {

    // configRequest,
    configUi,
    configPhase,
}