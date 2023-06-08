import __Zp from 'zep';

export default {
    /**
     * ##「组件」`Ex.uiTab`
     *
     * 构造Tab应用组件快速开发页签，为状态注入`__tabs`变量（内置）
     *
     * @memberOf module:ui/upper
     * @param {Object|ReactComponent} reference React组件引用。
     * @param {Function} consumer 构造Tab的回调函数。
     * @returns {*} 窗口引用
     */
    uiTab: (reference, consumer) =>
        __Zp.uiTab(reference, consumer),
    /**
     * ##「组件」`Ex.uiDialog`
     *
     * 构造Dialog引用组件快速开发窗口，为状态注入`__dialog`变量（内置）
     *
     * @memberOf module:ui/upper
     * @param {Object|ReactComponent} reference React组件引用。
     * @param {Function} consumer 构造Tab的回调函数。
     * @returns {*} 窗口引用
     */
    uiDialog: (reference, consumer) =>
        __Zp.uiDialog(reference, consumer)
}