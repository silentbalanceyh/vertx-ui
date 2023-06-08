// -------------- 更新专用方法 -----------------
import __Zu from 'zet';

/**
 * ## 「通道」`Ex.yuRouter`
 *
 * ### 1. 基本介绍
 *
 * 特殊方法，该方法在`Ux.isRoute`之前，需要和它做出对比：
 *
 * * `Ux.isRoute`是检查路由的路径是否发生更改（无关参数），返回true/false值。
 * * `Ex.yuRouter`是检查路由路径中的参数是否发生了更改，直接执行回调。
 *
 * ### 2. 代码示例
 *
 * ```js
 * const reference = this;
 * Ex.yuRouter(reference, {props, state}, () =>
 *      Ex.yiStandard(reference).then(Ux.pipe(reference)));
 * ```
 *
 * 操作界面同样是如下，左边点击菜单时只会发生参数更改，路由路径不变化。
 *
 * ```
 * |--------------------------------------------------|
 * |  Menu  |  Content ( List )                       |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |--------------------------------------------------|
 * ```
 *
 *
 * @memberOf module:yu/utter
 * @method yuRouter
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
 * @param {Function} callback 路由变化的回调函数
 */
const yuRouter = (reference, virtualRef, callback) =>
    __Zu.yuRouter(reference, virtualRef, callback);
/**
 * ## 「通道」`Ex.yuContainer`
 *
 * @memberOf module:yu/utter
 * @param reference
 * @param virtualRef
 */
const yuContainer = (reference, virtualRef = {}) =>
    __Zu.yuContainer(reference, virtualRef);
export default {
    yuRouter,
    yuContainer,
}