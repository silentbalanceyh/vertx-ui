import Ux from 'ux';
/*
 * Button / Link 中的 Dialog专用配置，直接的 Dialog不需要配置
 * 转换处理，Dialog的基础配置直接放到 config 变量中
 */
const configDialog = (input = {}) => {
    const {component = {}, ...button} = input;
    const dialog = {};
    /*
     * 窗口类型
     */
    dialog.type = component.type;
    /*
     * 窗口配置和 config 合并
     */
    Object.assign(dialog, component.dialog);
    /*
     * 组件和组件配置
     * component /
     * componentConfig
     */
    if ("string" === typeof dialog.onOk) {
        const id = dialog.onOk;
        dialog.onOk = () => Ux.connectId(id);
    }
    /*
     * 包含了 button 的情况，就直接使用 button
     */
    return {
        dialog,
        component: component.component,
        componentConfig: component.config,
        button,
    };
};
export default {
    configDialog
}