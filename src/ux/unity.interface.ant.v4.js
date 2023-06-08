import __Zo from 'zo';
import __Zs from 'zs';
import __Zn from "zone";

/**
 * ## 「标准」 `Ux.v4Icon`
 *
 * @memberOf module:v4/zone
 * @param type
 * @param rest
 * @returns {ReactNode}
 */
const v4Icon = (type, rest = {}) =>
    __Zo.v4Icon(type, rest);
/**
 * ## 「标准」 `Ux.v4FormFailure`
 *
 * @memberOf module:v4/zodiac
 * @param target
 * @param id
 * @param show
 */
const v4FormFailure = (target, id, show) =>
    __Zo.v4FormFailure(target, id, show);
/**
 * ## 「标准」`Ux.v4ChildItem`
 *
 * @memberOf module:v4/zest
 * @param items
 * @param reference
 * @returns {*}
 */
const v4ChildItem = (items = [], reference) =>
    __Zs.v4ChildItem(items, reference);
/**
 * ## 「标准」`Ux.v4Items`
 *
 * @memberOf module:v4/zest
 * @param items
 * @param configuration
 * @param reference
 * @returns {*}
 */
const v4Items = (items = [], configuration = {}, reference) =>
    __Zs.v4Items(items, configuration, reference);


export default {
    // Icon connected to ant-design V3
    v4Icon,
    // Form Error connected to ant-design V4
    v4FormFailure,
    /**
     * ## 「标准」`Ux.v4Child`
     *
     * @memberOf module:v4/zest
     * @method v4Child
     */
    v4Child: __Zs.v4Child,
    v4ChildItem,
    // v4Items / v4Tree
    v4Items,
    // Modal / message / notification
    /**
     * ## 「标准」`Ux.v4Modal`
     *
     * @memberOf module:v4/zone
     * @method v4Modal
     * @returns {Modal}
     */
    v4Modal: __Zn.v4Modal,
    /**
     * ## 「标准」`Ux.v4Notify`
     *
     * @memberOf module:v4/zone
     * @method v4Notify
     * @returns {Notification}
     */
    v4Notify: __Zn.v4Notify,
    /**
     * ## 「标准」`Ux.v4Message`
     *
     * @memberOf module:v4/zone
     * @method v4Message
     * @returns {Message}
     */
    v4Message: __Zn.v4Message,
    /**
     * ## 「标准」`Ux.V4App`
     *
     * * 组件，设置原生上下文
     *
     * @memberOf module:uca/zone
     * @method V4App
     * @returns {ReactNode}
     */
    V4App: __Zn.V4App,
    /**
     * ## 「标准」`Ux.V4InputGroup`
     *
     * * 组件，替换原生的 `<InputGroup/>` 组件。
     *
     * @memberOf module:uca/zone
     * @method V4InputGroup
     * @returns {ReactNode}
     */
    V4InputGroup: __Zn.V4InputGroup,
}