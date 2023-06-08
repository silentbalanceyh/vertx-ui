/**
 * ## 「组件」`DialogMenu`
 *
 * ```js
 * import { DialogMenu } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |$mode||props|String|设置窗口模式：`DIALOG | DRAWER`，该组件不支持浮游窗口。|
 * |$items||props|Array|菜单项相关配置。|
 * |$button||props|String/Object|调用`aiExprAction`解析该配置生成按钮专用配置。|
 * |$content||props|Object|不同菜单渲染的组件对象，上层传入外置对象。|
 * |$inited||props|Object|初始化表单值信息。|
 * |$loading||props|Boolean|是否处于提交/加载状态。|
 * |$functions||props|Object|执行CONFIRM时的回调函数，用于处理回调信息。|
 * |button||state|Object|主按钮配置信息。|
 * |items||state|Array|菜单项专用配置。|
 * |renders||state|Object|生成的子组件渲染器。|
 * |visible||state|Object|`key`=true/false，记录每个菜单项组件的显示/隐藏。|
 * |windows||state|Object|`key`=配置，记录每个窗口的配置信息。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 单个选项结构
 *
 * ```json
 * {
 *     "button": "按钮配置",
 *     "dialog": "窗口配置",
 *     "component": "使用的组件key，对应$content变量",
 *     "confirm": "删除专用，带有浮游提示窗口（是否）",
 *     "init": "布尔值，是否给子组件传入初始化数据信息。"
 * }
 * ```
 *
 * #### 3.2. 三种执行器
 *
 * * DIRECT：直接执行函数的执行器。
 * * DIALOG：窗口执行器，设置显示/隐藏专用执行器。
 * * CONFIRM：直接应用`Modal.confirm`的执行器。
 *
 * #### 3.3. 初始化数据渲染器
 *
 * 1. 先从props中读取`$inited`变量作为表单初始化变量。
 * 2. 判断`init`的值，过滤
 *      * `$disabled`
 *      * `$disabledItems`
 *      * `$inited`
 *      * `$items`
 *      * `$button`
 *      * `$functions`
 *      * `$content`
 *      * `$mode`
 * 3. 为`$inited`和`$parent`赋值
 *      * 带`_`前缀的字段直接放到`$inited`中。
 *      * $parent中存储的就是$inited数据。
 * 4. 追加`rxClose`专用方法进入子组件。
 *
 *
 * #### 3.4. 状态说明
 *
 * * `$loading`：组件是否处于加载状态，当前按钮的加载状态等价于提交状态，这个值会传递给子组件。
 * * `visible`：此处是一个Object类型，记录了每个组件的显示和隐藏状态。
 *
 * @memberOf module:uca/zion
 * @method * DialogMenu
 */
// =====================================================
// componentInit/componentUp
// =====================================================

export {DialogMenu} from 'zi';