declare module "web" {
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
    export {default as FileBatch} from './input/FileBatch/UI';              // 多文件上传
    export {default as FileLogo} from './input/FileLogo/UI';                // Logo上传
    export {default as JsonEditor} from './input/JsonEditor/UI';            // Json编辑器
    export {default as ListSelector} from './input/ListSelector/UI';        // 列表选择器
    export {default as MagicView} from './input/MagicView/UI';              // 各种视图专用
    export {default as MatrixSelector} from './input/MatrixSelector/UI';      // 数组选择器，选择结果是多个
    export {default as SearchInput} from './input/SearchInput/UI';
    export {default as TableTransfer} from './input/TableTransfer/UI';      // 树选择 + 表格编辑

    export {default as InputCaptcha} from './input/InputCaptcha/UI';        // 验证码
    export {default as InputArray} from './input/InputArray/UI';            // 多值输入，值结构为 Array
    export {default as InputProtocol} from './input/InputProtocol/UI';      // 协议输入框
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
}
