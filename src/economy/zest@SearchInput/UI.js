/**
 * ## 「组件」`SearchInput`
 *
 * 搜索专用输入
 *
 * ```js
 * import { SearchInput } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata":"contactName,联系人,12,,aiSearchInput",
 *      "optionJsx.layout":{
 *          "left": 14,
 *          "right": 10
 *      }
 * }
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |config|layout|props|Object|左右布局信息，左边输入框，右边Checkbox。|
 * |$data||state|Object|构造的查询条件信息。|
 *
 * ### 3. 组件核心点
 *
 * 查询条件支持两种：
 *
 * * 模糊匹配：`op值c`。
 * * 精确匹配：`op值=`。
 *
 * @memberOf module:uca/zest
 * @method SearchInput
 */
export {SearchInput} from 'zs';