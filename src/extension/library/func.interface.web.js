import __Zp from 'zep';

export default {
    // web系列方法专用
    /*
     * 「组件外层」
     * webAction 渲染，每一页右上角的按钮处理
     * event should be mapped to configured id and Ux.connectId instead.
     * --------> 「Input」
     * reference state
     * {
     *     $activeKey,
     *     $refresh,
     *     $loading
     * }
     * 「Output」---------> <Button/> ( 1 or N )
     */
    /**
     * ## 「扩展」`Ex.webAction`
     *
     * @memberOf module:web/upper
     * @param reference
     * @param configuration
     * @return {*}
     */
    webAction: (reference, configuration = {} /* webAction */) =>
        __Zp.webAction(reference, configuration),
    /*
     * Connect to webAction here, but 「组件内层」
     * -------->「Input」
     * reference props
     * {
     *     $region: "Single Region",
     *     $loading: "$loading of parent reference.state"
     * }
     * actionFn: Must be secondary fn () => () => {}, the system will build
     * action execution operation by actionFn(reference) and assign to action
     * Output also be <Button/>
     */
    /**
     * ## 「扩展」`Ex.webAnchor`
     *
     * @memberOf module:web/upper
     * @param reference
     * @param actionFn
     * @return {*}
     */
    webAnchor: (reference, actionFn = []) =>
        __Zp.webAnchor(reference, actionFn),
    /*
     * Group's group / build different usage data here.
     * config -> group should contain data
     */
    /**
     * ## 「扩展」`Ex.webTag`
     *
     * @memberOf module:web/upper
     * @param reference
     * @param configuration
     * @param actionFn
     * @return {*}
     */
    webTag: (reference, configuration = {} /* webTag */, actionFn = {}) =>
        __Zp.webTag(reference, configuration, actionFn)
}