/**
 * ## 「组件」`CheckJson`
 *
 * 多选框生成Json格式数据
 *
 * ```js
 * import { CheckJson } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "metadata,基本配置,24,,aiCheckJson",
 *      "optionJsx.config.items": [
 *          "design,可设计",
 *          "deletion,可删除"
 *      ]
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
 * |value||props|Any|Ant Form给当前组件传入的值。|
 * |$source||props|Array|多选框专用的选项信息，构造Options。|
 * |selected||state|Array|当前组件选中的值。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. Option数据结构
 *
 * `$source`会生成选项数据
 *
 * ```json
 * {
 *     "label": "选项显示文本",
 *     "value": "选项值",
 *     "disabled": "是否禁用"
 * }
 * ```
 *
 * #### 3.2. 值结构
 *
 * selected中保存的是`value`的集合，而组件调用上层`onChange`时传入的值结构为：
 *
 * ```json
 * {
 *     "field1": true,
 *     "field2": true,
 *     "...": true
 * }
 * ```
 *
 * 之中的`field1, field2，...`等构造的是每个Checkbox的字段的名称，最终生成的是Json结构的数据。
 *
 * @memberOf module:uca/zest
 * @method CheckJson
 **/
// =====================================================
// componentInit/componentUp
// =====================================================

export {CheckJson} from "zs";