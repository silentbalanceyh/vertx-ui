import __Zp from 'zep';

/**
 * ## 「通道」`Ex.ylCard`
 *
 * ### 1. 基本介绍
 *
 * 渲染带 `PageCard` 的页面专用组件。
 *
 * config 配置的数据结构
 *
 * ```js
 * {
 *      title: 左上标题（同一个页面切换刷参数时必须）
 *      header：提示信息，用于加载 LoadingAlert 的表单说明信息（头）
 *      name: 当前组件的名称
 *      color：当前日志的背景色（白色字体）
 * }
 * ```
 *
 * ### 2. 构造属性
 *
 * 该方法会根据`config`构造`PageCard`组件所需的所有属性，并且在执行渲染之前检查`$ready`的值，
 * 如果`$ready`值为true才执行界面渲染。
 *
 * |属性|含义|
 * |:---|:---|
 * |$title|左上角的标题信息。|
 * |$extra|构造extraContent右上角核心组件信息。|
 * |$leftVisible|是否显示左边按钮。|
 * |$disabled|是否禁用按钮。|
 * |reference|需传入的当前React组件引用。|
 *
 * @memberOf module:yl/upper
 * @method ylCard
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 子组件渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {JSX.Element}
 */
const ylCard = (reference, fnRender, config = {}) =>
    __Zp.ylCard(reference, fnRender, config);

/**
 * ## 「通道」`Ex.ylDynamic`
 *
 * ### 1. 基本介绍
 *
 * 用于渲染通用模块：
 *
 * 1. `/ambient/tabular/:type`    字典
 * 2. `/ambient/category/:type`   类别（树形字典）
 * 3. `/ambient/employee/:type`   员工
 * 4. `/ambient/identity/:type`   档案（个人隐私）
 * 5. `/ambient/customer/:type`   客户信息
 *
 * 专用统一模块渲染流程
 *
 * ### 2. 扩展模块
 *
 * 这个函数为扩展模块专用函数，主要用于简化扩展模块中的页面开发，这种页面大部分布局如下伪图：
 *
 * ```
 * |------------------------------------------|
 * | Title (Left)               (Right) Extra |
 * |------------------------------------------|
 * || Content                                ||
 * ||                                        ||
 * ||                                        ||
 * ||                                        ||
 * ||----------------------------------------||
 * ```
 *
 * PageCard主要用于定义上述不同区域的配置，且`ylDynamic`会将`cab`中的资源文件配置作为默认
 * 配置，如果从远程`X_MODULE`读取到了特殊配置则会覆盖默认配置。
 *
 * @memberOf module:yl/upper
 * @method ylDynamic
 * @param {Object|ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {JSX.Element}
 */
const ylDynamic = (reference, fnRender, config = {}) =>
    __Zp.ylDynamic(reference, fnRender, config);
/**
 * ## 「通道」`Ex.ylTabExtra`
 *
 * > 优先读取`Ex.yoAction`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理表单内部的按钮区域，它包含两种状态。
 *
 * |视图模式|按钮|含义|
 * |---|---|:---|
 * |add|`添加，重置`|添加表单界面专用按钮。|
 * |edit|`编辑，删除，重置`|编辑表单界面专用按钮。|
 *
 * 如果配置了`op.extension`那么扩展按钮会根据其`index`的配置插入到对应位置，并且这些按钮的显示还被下边两个因素影响：
 *
 * 1. 操作用户是否具有这些操作按钮的ACL权限。
 * 2. 这个列表中是否已经配置了这些按钮。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||state|config|计算当前Extra区域按钮的基本配置。|
 * |$submitting|state|Boolean|$submitting|是否处于提交状态（防重复提交专用属性）。|
 * |activeKey|第二参数|String|$activeKey|被激活的页签主键。|
 * |$view|state|String|$view|视图模式读取，三种：`list, add, edit`。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 满足构造条件
 *
 * 1. 视图模式必须是`add`或`edit`。
 * 2. 如果是`add`，必须配置了`tabs.extra.add`项。
 * 3. 如果是`edit`，必须配置了`tabs.extra.edit`项。
 *
 * > 如果构造条件不满足，那么extra部分不显示任何东西。
 *
 * #### 3.2. RESET
 *
 * 重置按钮是一个特殊的存在，必须是可操作按钮存在的情况才执行重置，如果不存在可操作按钮，那么重置会无效。
 *
 * 检测代码：
 *
 * ```js
 * // 检查是否计算结果是单独的重置按钮RESET
 * if (attrs.config && 1 === attrs.config.length) {
 *      attrs.config = attrs.config.filter(item => "op.submit.reset" !== item.category);
 * }
 * ```
 *
 * #### 3.3. 权限控制
 *
 * 调用`setEdition`内部私有方法计算可编辑的相关关系，实现对某个表单的ACL权限控制，直到可控制表单三态。
 *
 * @memberOf module:yl/upper
 * @param {Object|ReactComponent} reference React组件引用
 * @param {Object} tabs `<Tabs/>`的基本配置
 * @param {Function} UI
 * @returns {Object}
 */
const ylTabExtra = (reference, tabs = {}, UI) =>
    __Zp.ylTabExtra(reference, tabs, UI);

export default {
    ylCard,         // 带 PageCard 页面专用
    ylDynamic,      // 动态页面专用
    ylTabExtra,     // 表单专用处理
}