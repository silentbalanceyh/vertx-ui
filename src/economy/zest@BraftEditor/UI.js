/**
 * ## 「组件」`BraftEditor`
 *
 * 富文本编辑器
 *
 * ```js
 * import { BraftEditor } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Any|Ant Form给当前组件传入的值。|
 * |config||state|Object|当前编辑器的配置。|
 * |config|controls|state|Array|打开或禁用编辑器的工具栏选项。|
 * |content||state|EditorState|当前编辑器的内容。|
 *
 * ### 3. 组件核心点
 *
 * > 目前富文本编辑器还未执行重置以及content部分的上层onChange方法调用，后续需要补充开发。
 *
 * @memberOf module:uca/zest
 * @method BraftEditor
 **/
// =====================================================
// componentInit/componentUp
// =====================================================

export {BraftEditor} from 'zs';