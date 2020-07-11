// ------ 绘图专用组件 ------
// ------ 新版使用Editor替换原始的Designer
// -------------------------------  还在实验
// export {default as RichEditor} from './input/RichEditor/UI';
export {default as BraftEditor} from './input/BraftEditor/UI';
// -------------------------------  表单专用
export {default as PageCard} from './container/PageCard/UI';

export {default as LoadingContent} from './loading/LoadingContent/UI';
export {default as LoadingAlert} from './loading/LoadingAlert/UI';

export {default as DialogButton} from './action/DialogButton/UI';
export {default as DialogMenu} from './action/DialogMenu/UI';
// ------------------------------- 容器型字段
/*
 * raftContainer方法专用
 */
export {default as Container} from './input/_container';        // 容器型字段
// -------------------------------  表单专用

// 重写过的可用的自定义组件
export {default as TableEditor} from './input/TableEditor/UI';
export {default as CheckTransfer} from './input/CheckTransfer/UI';      // 多选列表型穿梭框
export {default as DialogEditor} from './input/DialogEditor/UI';        // 表格 + 弹框（子表单），支持增删改
export {default as MagicView} from './input/MagicView/UI';              // 各种视图专用
export {default as ListSelector} from './input/ListSelector/UI';        // 列表选择器
export {default as TreeSelector} from './input/TreeSelector/UI';        // 树选择器
export {default as AddressSelector} from './input/AddressSelector/UI';  // 地址选择器
export {default as FileUpload} from './input/FileUpload/UI';            // 上传专用控件
export {default as JsonEditor} from './input/JsonEditor/UI';            // Json编辑器
export {default as CheckJson} from './input/CheckJson/UI';              // CheckBox多项属性Json格式
export {default as InputArray} from './input/InputArray/UI';            // 多值输入，值结构为 Array

// ------------------------------- 复杂搜索组件
export {default as SearchInput} from './input/SearchInput/UI';
export {default as SearchRangeDate} from './input/SearchRangeDate/UI';
// -------------------------------  表格列专用
export {default as ColumnUser} from './action/ColumnUser/UI';
export {default as RestfulApi} from './editor-form/RestfulApi/UI';
// -------------------------------  重新命名过的组件
/*
 * 新：Dialog
 * 新：Navigation
 */
export {default as Dialog} from './container/Dialog/UI';
export {default as Navigation} from './container/Navigation/UI';
export {default as Rectangle} from './container/Rectangle/UI';
/*
 * 旧：PagerHeader
 * 旧：DynamicDialog
 */
export {default as DynamicDialog} from './container/Dialog/UI';
export {default as PagerHeader} from './container/Navigation/UI';
/*
 * 编辑器
 */
export {default as GraphicEditor} from './editor-graphic/GraphicEditor/UI';
export {default as GraphicViewer} from './editor-graphic/GraphicViewer/UI';
export {default as FormDesigner} from './editor-form/FormDesigner/UI';
/*
 * 自定义组件专用
 */
export {component} from './_internal'