import xuiControl from './xui.fn.control';
import Chk from '../channel';

/**
 * ## 扩展函数
 *
 * 执行 `xuiDecorator` 修饰包装组件。
 *
 * @memberOf module:_xui
 * @method xuiDecorator
 * @param {Object} config 修饰组件专用配置数据
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {State} state 组件专用状态信息
 * @returns {boolean|Jsx} 渲染修饰过的组件
 */
export default (config = {}, UI = {}, inherit = {}, state = {}) => {
    // TODO: Usage in future
    const $control = Chk.yoControl(config);
    /* 激活专用 */
    if (state && state.$switcher) {
        inherit.$switcher = state.$switcher;
    }
    return xuiControl($control, UI, inherit);
}