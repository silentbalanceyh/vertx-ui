import xuiControl from './xui.fn.control';
import Chk from '../channel';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 执行 `xuiDecorator` 修饰包装组件。
 * 1. 提取 control 中的配置信息
 * 2. 是否执行了 $switcher 的随机跳跃处理（刷新界面专用）
 * 3. 事件执行器，针对特殊节点：`decorator` 执行事件注入解析工作
 *
 * @memberOf module:_xui
 * @method xuiDecorator
 * @param {Object} configuration 修饰组件专用配置数据
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {State} state 组件专用状态信息
 * @returns {boolean|Jsx} 渲染修饰过的组件
 */
export default (configuration = {}, UI = {}, inherit = {}, state = {}) => {
    // TODO: Usage in future
    const $control = Chk.yoControl(configuration);
    /* 激活专用 */
    const $inherit = Ux.clone(inherit);
    if (state && state.$switcher) {
        $inherit.$switcher = state.$switcher;
    }
    return xuiControl($control, UI, $inherit);
}