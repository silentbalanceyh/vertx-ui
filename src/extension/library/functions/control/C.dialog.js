import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 窗口扩展配置
 *
 * Button / Link 中的 Dialog专用配置，直接的 Dialog不需要配置
 * 转换处理，Dialog的基础配置直接放到 config 变量中
 *
 * 返回数据格式如：
 *
 * ```json
 * {
 *      button: "按钮基本配置",
 *      dialog: "关联窗口配置",
 *      component: "按钮关联组件",
 *      componentConfig: "关联组件配置"
 * }
 * ```
 * @memberOf module:_config
 * @param {Object} input 基本输入配置
 * @returns {Object} 返回构造好的配置
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