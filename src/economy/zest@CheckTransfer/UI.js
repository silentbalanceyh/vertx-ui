/**
 * ## 「组件」`CheckTransfer`
 *
 * Transfer穿梭框
 *
 * ```js
 * import { CheckTransfer } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Array|Ant Form给当前组件传入的值，表示选中的值。|
 * |config|valueKey|props|String|取值的字段信息，默认为`key`。|
 * |config|limit|props|Object|选择项限制信息，用于验证，如果选择项目过多会提示错误信息。|
 * |$source||props|Array|穿梭框中可选择的数据源信息。|
 * |$transfer|onChange|state|Function|改变值时的操作。|
 * |$transfer|onSelectChange|state|Function|选中选项时的回调函数，执行选择。|
 * |$transfer|render|state|Function|`<Transfer/>`中的render渲染函数设置。|
 * |$sourceKeys||state|Array|选择过程中的源选择值。|
 * |$targetKeys||state|Array|选择过程中的目标选择值。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 选项设置
 *
 * #### 3.1. dataSource数据格式如：
 *
 * ```json
 * {
 *     "key": "数据记录键",
 *     "title": "标题",
 *     "description": "描述信息",
 *     "disabled": "禁用/启用"
 * }
 * ```
 *
 * #### 3.2. limit数据结构
 *
 * ```json
 * {
 *     "max": "最大选项数"，
 *     "message": "验证错误信息"
 * }
 * ```
 *
 * 如果选项超过了`max`的限制，则显示错误消息，调用`Ux.messageFailure`函数显示错误信息。
 *
 * @memberOf module:uca/zest
 * @method CheckTransfer
 */
// =====================================================
// componentInit/componentUp
// =====================================================

export {CheckTransfer} from "zs";
