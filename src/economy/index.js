// 重写过的可用的自定义组件
export {default as TableEditor} from './input/TableEditor/UI';          // 表格编辑器
export {default as TreeSelector} from './input/TreeSelector/UI';        // 树选择器
export {default as SearchRangeDate} from './input/SearchRangeDate/UI';

// 内置使用，不带文档
export {component} from './_internal'
export {default as Container} from './input/_container';        // 容器型字段
export {default as RestfulApi} from './editor-form/RestfulApi/UI';
export {default as FormDesigner} from './editor-form/FormDesigner/UI';
// web组件（表单专用）
export {default as AddressSelector} from './input/AddressSelector/UI';  // 地址选择器
export {default as BraftEditor} from './input/BraftEditor/UI';          // 富文本编辑器
export {default as CheckJson} from './input/CheckJson/UI';              // CheckBox多项属性Json格式
export {default as CheckTransfer} from './input/CheckTransfer/UI';      // 多选列表型穿梭框
export {default as DialogEditor} from './input/DialogEditor/UI';        // 表格 + 弹框（子表单），支持增删改
export {default as FileUpload} from './input/FileUpload/UI';            // 上传专用控件
export {default as InputArray} from './input/InputArray/UI';            // 多值输入，值结构为 Array
export {default as JsonEditor} from './input/JsonEditor/UI';            // Json编辑器
export {default as ListSelector} from './input/ListSelector/UI';        // 列表选择器
export {default as MagicView} from './input/MagicView/UI';              // 各种视图专用
export {default as MatrixSelector} from './input/MatrixSelector/UI';      // 数组选择器，选择结果是多个
export {default as SearchInput} from './input/SearchInput/UI';
export {default as TableTransfer} from './input/TableTransfer/UI';      // 树选择 + 表格编辑
// web组件（带children）
export {default as PageCard} from './web/PageCard/UI';
export {default as Rectangle} from './web/Rectangle/UI';
export {default as Dialog} from './web/Dialog/UI';
export {default as DialogButton} from './web/DialogButton/UI';
export {default as DialogMenu} from './web/DialogMenu/UI';
export {default as DynamicDialog} from './web/Dialog/UI';         // 旧版本
// web组件
export {default as G6Editor} from './web/G6Editor/UI';
export {default as G6Viewer} from './web/G6Viewer/UI';
export {default as Graphic2} from './web/Graphic2/UI';
export {default as ColumnUser} from './web/ColumnUser/UI';
export {default as NavSwallow} from './web/NavSwallow/UI';
export {default as Navigation} from './web/Navigation/UI';
export {default as PagerHeader} from './web/Navigation/UI';       // 旧版本
export {default as LoadingContent} from './web/LoadingContent/UI';
export {default as LoadingAlert} from './web/LoadingAlert/UI';

/**
 * # Zero Ui 中的Web组件
 *
 * ## 1.组件使用
 *
 * 组使用的代码如下：
 *
 * ```js
 * import { XXX } from 'web';
 *
 * // .....
 * return (
 *      <XXX/>
 * )
 * ```
 *
 * > economy组件层位于ux工具之上，可直接执行如下代码
 *
 * ```js
 * import Ux from 'ux';
 * ```
 *
 * ## 2.组件文档标记
 *
 * 1. 属性props：直接从上层组件中继承过来的属性。
 * 2. 状态state：当前组件执行componentDidMount构造的状态。
 *
 * ## 3.组件列表
 *
 * > 生命周期中的单个标记分别对应`Hoc生命周期，Mount初始化，Update更新`三个生命周期。
 *
 * |组件名|生命周期|相关Ant组件|className|说明|
 * |:---|:---|---|:---|:---|:---|
 * |* Dialog|x o o|`<Modal/>`|web-dialog <br> web-dynamic-dialog|动态弹出框专用组件，可配置不同弹出框。|
 * |* DialogButton|x o x|`<Button/>`<br>-- `<Modal/>`<br>-- `<Drawer/>`<br/>-- `<Popover/>`|web-dialog-button-header|带子组件的按钮，可渲染按钮内组件。|
 * |* DialogMenu|x o x|`<Dropdown/>`<br>--`<Menu/>`<br>--`<Button/>`||包含子组件专用的菜单执行。|
 * |* PageCard|o o x|`<Card/>`|web-card|卡片组件容器。|
 * |* Rectangle|x x x|`<fieldset/>`|web-rectangle|「Html」专用HTML矩形元素。|
 * |ColumnUser|x o x|`<Fragment/>`||表格中的列渲染专用`<Table/>`执行。|
 * |G6Editor|x o x|复杂元素|web-g6-editor|拓扑图编辑器|
 * |G6Viewer|x o x|复杂元素|web-g6-viewer|拓扑图查看器|
 * |Graphic2|x o o|`<div/>`||G2渲染图信息。|
 * |LoadingAlert|x x x|`<Alert/>`|web-alert-iconlist <br> web-alert-list <br> web-alert-text|警告信息专用组件，支持多行文本、图标计算、多数据格式、直接配置模式。|
 * |LoadingContent|o x x|`<Spin/>`|web-loading|加载效果专用组件，支持组件/页面/区域三种。|
 * |Navigation|x x x|`<Breadcrumb/>`|web-navigation|面包屑导航组件。|
 * |NavSwallow|x x x|`<div/>`|web-nav-swallow|燕尾导航专用组件。|
 *
 * ## 4.设计原则
 *
 * 1. 属性传入过程中的所有内容（源 = props），都是通过编程方式传入，优先级最高，它通常会覆盖Zero Ui解析过后的默认行为。
 * 2. 只要存在状态数据，在`render`中都会调用`Ux.xtReady`方法执行加载完成后的第一个render，该操作可防止异步结果未完成导致的渲染错误。
 *
 * ### 4.1. 特殊说明
 *
 * 1. Dialog中的`web-dynamic-dialog`是遗留系统使用的className，新系统都会使用`web-dialog`来实现，暂时未重构。
 * 2. 组件中带`*`的表示当前组件支持`children`属性，即组件本身为容器组件。
 * 3. `FormDesigner`不提供文档说明，因为它主要存在于Ox中的配置模块，不属于标准操作，通常是直接使用。
 *
 * ### 4.2. 基础文件规范
 *
 * #### 4.2.1. 文件规范
 *
 * |文件|说明|
 * |:---|:---|
 * |UI.js|主入口源代码文件。|
 * |Op.js|事件专用源代码文件。|
 * |Web.jsx|Jsx渲染专用函数。|
 *
 * #### 4.2.2. 函数规范
 *
 * |特定函数|说明|
 * |:---|:---|
 * |componentCt|构造函数，constructor函数专用。|
 * |componentInit|初始化函数，componentDidMount函数专用。|
 * |componentUp|更新函数，componentDidUpdate函数专用。|
 * |renderXXX|Jsx渲染专用函数。|
 * |yiXXX|初始化状态专用方法（子方法、主方法）。|
 * |yoXXX|渲染组件专用计算方法。|
 *
 * #### 4.2.3. 属性状态规范
 *
 * |变量|源|说明|
 * |:---|:---|:---|
 * |config|props|组件配置数据。|
 * |data|props|组件核心数据（一般是业务数据）。|
 * |rxInject|props|「开发专用」注入专用，修改配置用。|
 * |$submitting|props|防重复提交的专用属性，$submitting = true表示正在提交。|
 * |$ready|state|加载完成专用属性。|
 *
 * @module web-component
 */
/**
 * # Zero Ui 中的Form组件
 *
 * （略）基本信息参考`web-component`部分。
 *
 * ## 1.组件列表
 *
 * |组件名|生命周期|className|说明|
 * |:---|---|:---|:---|
 * |AddressSelector|x o o|无|地址选择器。|
 * |BraftEditor|x x o|web-braft-editor|富文本编辑器。|
 * |CheckJson|x o o|web-check-json|多选框生成Json数据。|
 * |CheckTransfer|x o o|web-transfer|带选择的穿梭框。|
 * |DialogEditor|x o o|web-table <br> web-dialogeditor-table <br> web-dialog|弹出框表格编辑器。|
 * |FileUpload|o o o|web-file-upload|上传专用组件。|
 * |InputArray|x o o|web-input-array|数组元素录入组件。|
 * |JsonEditor|x x x|无|JSON编辑器。|
 * |ListSelector|x o o|web-dialog|列表选择器。|
 * |MagicView|x x x|web-magic-view <br> web-table|显示数据信息。|
 * |MatrixSelector|x o o|web-table <br> web-matrixselector-table <br> web-dialog|弹出框多选器。|
 * |SearchInput|o o o|无|「搜索」增强版查询条件输入。|
 * |SearchRangeDate|o o o|web-range-date|「搜索」时间条件输入。|
 * |TableEditor|o o x|web-table-editor|表格编辑器。|
 * |TreeSelector|x o o|web-dialog|树选择器。|
 *
 * ## 2.组件配置矩阵
 *
 * |组件名|配置render|2阶render|相关Ant组件|
 * |:---|:---|:---|:---|
 * |AddressSelector|aiAddressSelector|Ok|`<Cascader/>`|
 * |BraftEditor|aiBraftEditor|x|`<BraftEditor/>`|
 * |CheckJson|aiCheckJson|x|`<Checkbox/>`|
 * |CheckTransfer|aiTransfer|ai2Transfer|`<Transfer/>`|
 * |DialogEditor|aiDialogEditor|x|`<Table/>`<br>`<Dialog/>`|
 * |FileUpload|aiFileUpload|x|`<Upload/>`|
 * |InputArray|aiInputMulti|ai2InputMulti|`<Input/>` <br> `<Button/>`|
 * |JsonEditor|aiJsonEditor|x|`<JSONInput/>`|
 * |ListSelector|aiListSelector|ai2ListSelector|`<Input/>` <br> `<Dialog/>` <br> `<Table/>`|
 * |MagicView|aiMagic|x|`<Table/>` <br> `<ColumnUser/>` <br> `<span/>`|
 * |MatrixSelector|aiMatrixSelector|ai2MatrixSelector|`<Table/>`<br>`<Dialog/>`|
 * |SearchInput|aiSearchInput|x|`<Input/>` <br> `<Checkbox/>`|
 * |SearchRangeDate|aiSearchRangeDate|x|`<DatePicker/>`|
 * |TableEditor|aiTableEditor|x|`<Table/>` <br> `<Button/>`|
 * |TreeSelector|aiTreeSelector|ai2TreeSelector|`<Input/>` <br> `<Dialog/>` <br/> `<Tree/>`|
 * ||aiInput|ai2Input|`<Input/>`|
 * ||aiPassword|ai2Password|`<Input.Password/>`|
 * ||aiInputNumber|ai2InputNumber|`<InputNumber/>`|
 * ||aiCheckbox|ai2Checkbox|`<Checkbox/>`|
 * ||aiSubmit|x|`<Button/>`|
 * ||aiAction|x|`<Button/>`|
 * ||aiHidden|x|`<Input/>`|
 * ||aiSelect|ai2Select|`<Select/>`|
 * ||aiTextArea|ai2TextArea|`<Input.TextArea/>`|
 * ||aiDatePicker|ai2DatePicker|`<DatePicker/>`|
 * ||aiTimePicker|x|`<TimePicker/>`|
 * ||aiTreeSelect|ai2TreeSelect|`<TreeSelect/>`|
 * ||aiRadio|ai2Radio|`<Radio/>`|
 * ||aiButton|x|`<Button/>`|
 * ||aiButtonGroup|x|`<Button/>`|
 *
 *
 * @module web-input
 */