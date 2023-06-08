declare module "web" {
// 重写过的可用的自定义组件
    export {TableEditor} from './zest@TableEditor/UI';                      // 表格编辑器
    export {TreeSelector} from './zest@TreeSelector/UI';                    // 树选择器
    export {SearchRangeDate} from './zest@SearchRangeDate/UI';

    // 内置使用，不带文档
    export {
        default as Container,
        uca,
        uca as component                                                // 旧版本兼容
    } from './zest.__.@container';                                      // 容器型字段
    export {FormDesigner} from './zero@FormDesigner/UI';
    export {DataSource} from './zero@DataSource/UI';
    export {DatumUnique} from './zero@DatumUnique/UI';
    export {ParamInput} from './zero@ParamInput/UI';
    export {ParamPanel} from './zero@ParamPanel/UI';
    export {RestfulApi} from './zero@RestfulApi/UI';
    export {ValueSource} from './zero@ValueSource/UI';
    // web组件（表单专用）
    export {AddressSelector} from './zest@AddressSelector/UI';              // 地址选择器
    export {BraftEditor} from './zest@BraftEditor/UI';                      // 富文本编辑器
    export {CheckJson} from './zest@CheckJson/UI';                          // CheckBox多项属性Json格式
    export {CheckTransfer} from './zest@CheckTransfer/UI';                  // 多选列表型穿梭框
    export {DialogEditor} from './zest@DialogEditor/UI';                    // 表格 + 弹框（子表单），支持增删改
    export {FileUpload} from './zest@FileUpload/UI';                        // 上传专用控件
    export {FileBatch} from './zest@FileBatch/UI';                          // 多文件上传
    export {FileLogo} from './zest@FileLogo/UI';                            // Logo上传
    export {JsonEditor} from './zest@JsonEditor/UI';                        // Json编辑器
    export {ListSelector} from './zest@ListSelector/UI';                    // 列表选择器
    export {MagicView} from './zest@MagicView/UI';                          // 各种视图专用
    export {MatrixSelector} from './zest@MatrixSelector/UI';                // 数组选择器，选择结果是多个
    export {SearchInput} from './zest@SearchInput/UI';
    export {TableTransfer} from './zest@TableTransfer/UI';                  // 树选择 + 表格编辑

    export {InputArray} from './zest@InputArray/UI';                        // 多值输入，值结构为 Array
    export {InputCaptcha} from './zest@InputCaptcha/UI';                    // 验证码
    export {InputProtocol} from './zest@InputProtocol/UI';                  // 协议输入框
// 用户相关交互式组件
    export {UserSelector} from './zest@UserSelector/UI';                    // 用户筛选器
    export {UserLeader} from './zest@UserLeader/UI';                        // 按部门/组进行经理筛选
    export {UserGroup} from './zest@UserGroup/UI';                          // 设置用户组
    export {GroupSwitcher} from './zest@GroupSwitcher/UI';                  // 用户组选择

// web组件（带children）
    export {default as PageCard} from './web@PageCard/UI';
    export {default as Rectangle} from './web@Rectangle/UI';
    export {DialogButton} from './zion@DialogButton/UI';
    export {DialogMenu} from './zion@DialogMenu/UI';
// web组件
    export {default as G6Editor} from './web@G6Editor/UI';
    export {default as G6Viewer} from './web@G6Viewer/UI';
    export {default as Graphic2} from './web@Graphic2/UI';
    export {default as NavSwallow} from './web@NavSwallow/UI';
    export {default as Navigation} from './web@Navigation/UI';
    export {default as PagerHeader} from './web@Navigation/UI';       // 旧版本
// row组件
    export {default as RowStar} from './web@RowStar/UI';
// 新版
    export {LoadingContent} from './zion@LoadingContent/UI';
    export {Dialog} from './zion@Dialog/UI';
    export {Dialog as DynamicDialog} from './zion@Dialog/UI';         // 旧版
    export {LoadingAlert} from './zone@LoadingAlert/UI';
    export {LazyColumn} from './zion@LazyColumn/UI';
    export {LazyColumn as ColumnUser} from './zion@LazyColumn/UI';    // 旧版
}
