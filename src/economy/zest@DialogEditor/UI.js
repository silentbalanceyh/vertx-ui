/**
 * ## 「组件」`DialogEditor`
 *
 * 弹出框表格编辑器
 *
 * ```js
 * import { DialogEditor } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "subTasks,,24,,aiDialogEditor",
 *      "optionJsx.config": {
 *          "form": "FormSub",
 *          "dialog": "新增数据导入子任务,保存,关闭,false,1024,true,$opSaveTask",
 *          "op": {
 *              "add": "$opShowSub"
 *          },
 *          "table": {
 *              "columns": [
 *                  "source,导入表",
 *                  "target,目标表",
 *                  "runAt,上次导入时间",
 *                  "runCount,上次导入条数",
 *                  "nextAt,下次导入时间",
 *                  "isRun,是否执行",
 *                  {
 *                      "title": "操作",
 *                      "dataIndex": "key",
 *                      "fixed": "right",
 *                      "$render": "EXECUTOR",
 *                      "$option": [
 *                          {
 *                              "text": "编辑",
 *                              "executor": "fnEdit"
 *                          },
 *                          "divider",
 *                          {
 *                              "text": "删除",
 *                              "executor": "fnDelete",
 *                              "confirm": "确认删除选择的实体记录？"
 *                          }
 *                      ]
 *                  }
 *              ]
 *          }
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
 * |value||props|Any|Ant Form给当前组件传入的值。|
 * |reference||props|React|父引用，遵循Zero Ui的规范，该变量为固定变量，引用父组件。|
 * |readOnly||props|Boolean|当前字段是否只读，可编辑走yiEdition，只读走yiView。|
 * |config|table|props|Object|表格基本配置。|
 * |config|dialog|props|String/Object|弹出框的专用配置。|
 * |config|form|props|Object|当前DialogEditor所需的表单数据。|
 * |config|op|props|Object|按钮链接，可触发对应按钮执行窗口操作。|
 * |$rows||props|Object|构造行操作符，用于增加更多的操作，`fnEdit/fnDelete`是默认值。|
 * |$forms||props|Object|传入的表单哈希表`name = Jsx`格式。|
 * |$executor||props|Object|行操作的执行函数哈希表`name = Function`格式。|
 * |$op||props|Object|执行二阶段专用操作，可绑定到二级form中。|
 * |$record||props|Object|「数据」执行可传的数据记录。|
 * |$options||props|Object|「配置」执行科传的配置记录。|
 * |$table||state|Object|表格配置`<Table/>`。|
 * |$dialog||state|Object|窗口配置`<Dialog/>`。|
 * |$button||state|Array|按钮配置`<Button/>`，右上角点击的按钮。|
 * |$visible||state|Boolean|窗口显示/隐藏。|
 * |$inited||state|Object|表单初始化数据，点击按钮时会生效。|
 * |$mode||state|String|表单支持的模式，ADD/EDIT，添加和编辑。|
 * |$submitting||state|Boolean|表单是否在提交（防重复提交专用）。|
 * |$keyField||state|String|主键字段名，`<Table/>`使用该字段作为主键，计算时读取`config.table.rowKey`。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 * |fnComponent||state|Function|渲染窗口内组件的专用函数。|
 *
 * > $rows和$executor可能重复了，因为该组件位于两个不同阶段的开发周期，最早使用过$rows，后续改成了$executor，文档之后来更新。
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 表单配置的模式
 *
 * DialogEditor表单来源分成三种模式：
 *
 * **1）编程模式**
 *
 * 编程模式中的`config.form`是一个字符串，它的计算流程如下：
 *
 * 1. 读取父引用`reference`（该引用绑定了Ant Form，带有form引用）。
 * 2. 从props中读取`$form`对象（`name = Jsx`），并且使用`$form[form]`去读取子组件。
 * 3. 用该子组件构造`fnComponent`渲染外层表单。
 *
 * **2）直接配置模式**
 *
 * 1. 直接构造`fnComponent`方法，此时使用组件为`UI.Form.js`中的组件
 * 2. 构造`fnComponent`渲染新表单
 *
 * **3）动态模式**
 *
 * （保留模式，只有一个form的`code`，用于远程读取表单配置。）
 *
 * #### 3.2. 子组件继承项
 *
 * 在渲染表单过程中，继承项主要用于往Form中传入数据，传如的数据如
 *
 * **1）上层属性**
 *
 * 直接调用`Ux.onUniform`构造的继承属性。
 *
 * **2）本层属性**
 *
 * |属性名|类型|说明|
 * |:---|---|:---|
 * |reference|React引用|将DialogEditor的React组件引用赋值给下层成为下层表单`父引用`标准。|
 * |rxRow|Function|「单记录」行保存专用方法。|
 * |rxRows|Function|「批量」行保存专用方法。|
 * |$record|Any|直接传入$record。|
 * |$options|Any|直接传入$options。|
 * |$op|Any|直接传入$op。|
 * |$a_form_xxx|Any|将上层表单中的数据存储到这里执行`name=value`的传入（一般用于配置型）。|
 *
 *
 * #### 3.3. fnEdit/fnOpen更改状态
 *
 * **1）打开新窗口生成状态**
 *
 * ```js
 * {
 *     $inited: {
 *         key: "随机UUID（新记录主键）",
 *         parentId: "读取$inited的key（父记录主键）"
 *     },
 *     $mode: "ADD",
 *     $visible: true
 * }
 * ```
 *
 * **2）选中记录打开窗口**
 *
 * ```js
 * {
 *     $inited: {
 *         key: "根据$keyField计算，从记录中读取主键。",
 *         parentId: "读取$inited的key（父记录主键）"
 *     },
 *     $mode: "EDIT",
 *     $visible: true
 * }
 * ```
 *
 * ### 4. 子组件Form核心点
 *
 * 只有**配置型**（非编程模式）才会启用`UI.Form.js`中的表单。
 *
 * #### 4.1. 数据传入
 *
 * * $op：直接传入。
 * * $options：配置选项，在`ExListComplex`等类型组件传入的配置信息。
 * * $record：数据传入，可自定义，也可传入数据。
 *
 * #### 4.2. 关于$op的使用
 *
 * 按钮绑定在执行的时候可以直接往下传递，在特别复杂或者层级比较多的场景中非常使用，此处后续使用时来补充教程文档。
 *
 * #### 4.3. 关于$executor
 *
 * $executor主要用于构造表格中的操作列，默认有
 *
 * * fnEdit：编辑链接
 * * fnDelete：删除连接
 *
 * $executor配合列中的`CONNECT`渲染可执行动态注入流程，最新的`ExListOpen`组件中有使用，可参考。
 *
 * @memberOf module:uca/zest
 * @method DialogEditor
 */
// =====================================================
// componentInit/componentUp
// =====================================================

export {DialogEditor} from 'zs';