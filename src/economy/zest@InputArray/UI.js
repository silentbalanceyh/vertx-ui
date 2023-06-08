/**
 * ## 「组件」`InputArray`
 *
 * 数组录入组件
 *
 * ```js
 * import { InputArray } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "dependValue,条件字段值,24,,aiInputMulti",
 *      "optionJsx.styleInput": {
 *          "width": "30%"
 *      },
 *      "optionJsx.depend.enabled": {
 *          "dependType": [
 *              "DATUM"
 *          ]
 *      }
 * }
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
 * |value||props|Array|Ant Form给当前组件传入的值。|
 * |config|limit|props|Object|当前组件录入数组的长度限制。|
 * |disabled||props|Boolean|是否禁用当前组件。|
 * |styleInput||props|Object|当前组件中输入框风格。|
 * |$holder||state|Number|当前数据的长度信息。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 关于限制处理
 *
 * 这个组件的限制处理并不是弹出错误信息，而是直接禁用添加按钮，当选项数量`$holder`大于了限制数量，
 * 则会禁用添加按钮。
 *
 * #### 3.2. 禁用
 *
 * 如果传入了`disabled=true`则会禁用当前组件的所有操作。
 *
 * @memberOf module:uca/zest
 * @method InputArray
 */
// =====================================================
// componentInit/componentUp
// =====================================================
export {InputArray} from "zs";