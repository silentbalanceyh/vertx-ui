// ------ 绘图专用组件 ------
// ------ 新版使用Editor替换原始的Designer
// -------------------------------  还在实验
export {default as RichEditor} from './input/RichEditor/UI';
export {default as BraftEditor} from './input/BraftEditor/UI';
export {default as TeamSelector} from './input/TeamSelector/UI';

// -------------------------------  表单专用
export {default as PageCard} from './container/PageCard/UI';

export {default as LoadingContent} from './loading/LoadingContent/UI';
export {default as LoadingAlert} from './loading/LoadingAlert/UI';
export {default as LoadingImage} from './loading/LoadingImage/UI';

export {default as DialogButton} from './action/DialogButton/UI';
export {default as DialogMenu} from './action/DialogMenu/UI';
// ------------------------------- 容器型字段
/*
 * raftContainer方法专用
 */
export {default as Container} from './input/_container';        // 容器型字段
// -------------------------------  表单专用
// 待验证（北京二期标展专用）
export {default as MultiCheckBox} from './input/MultiCheckBox/UI';
export {default as DateVersion} from './input/DateVersion/UI';
export {default as ChangeEditor} from './input/ChangeEditor/UI';
export {default as TableEditor} from './input/TableEditor/UI';
export {default as TableTransfer} from './input/TableTransfer/UI';
export {default as CheckedInput} from './input/CheckedInput/UI';
export {default as CheckedDate} from './input/CheckedDate/UI';
export {default as TimeRanger} from './input/TimeRanger/UI';
export {default as TableRowEditor} from './input/TableRowEditor/UI';
export {default as MatrixEditor} from './input/MatrixEditor/UI';
export {default as FixedTreeEditor} from './input/FixedTreeEditor/UI';
export {default as FuncInputTree} from './input/FuncInputTree/UI';
export {default as JsonEditor} from './input/JsonEditor/UI';

// 重写过的可用的自定义组件
export {default as CheckTransfer} from './input/CheckTransfer/UI';      // 多选列表型穿梭框
export {default as DialogEditor} from './input/DialogEditor/UI';        // 表格 + 弹框（子表单），支持增删改
export {default as MagicView} from './input/MagicView/UI';              // 各种视图专用
export {default as ListSelector} from './input/ListSelector/UI';        // 列表选择器
export {default as TreeSelector} from './input/TreeSelector/UI';        // 树选择器
export {default as AddressSelector} from './input/AddressSelector/UI';  // 地址选择器
export {default as FileUpload} from './input/FileUpload/UI';            // 上传专用控件
// 复杂搜索组件
export {default as SearchInput} from './input/SearchInput/UI';
export {default as SearchRangeDate} from './input/SearchRangeDate/UI';
// -------------------------------  表格列专用
export {default as ColumnUser} from './action/ColumnUser/UI';
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
export {default as GraphicEditor} from './editor/GraphicEditor/UI';
export {default as GraphicViewer} from './editor/GraphicViewer/UI';