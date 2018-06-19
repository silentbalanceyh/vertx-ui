import HOC from "./Ux.Hoc";
import ENV from "./Ux.Env";
import AJAX from "./Ux.Ajax";
import LOGGER from "./Ux.Log";
import ENCRYPT from "./Ux.Encrypt";
import RANDOM from "./Ux.Random";
import EXPR from "./Ux.Expr";
import STORE from "./Ux.Store";
import GLOBAL from "./Ux.Global";
import PROP from "./Ux.Prop";
import JSX from "./Ux.Jsx";
import OP from "./Ux.Op";
import SORTER from "./Ux.Sorter";
import ICONS from "./Ux.Icon";
import ANT from "./Ux.Ant";
import OPTION from "./Ux.Option";
import NORM from "./Ux.Normalize";
import TYPES from "./Ux.Type";
import FORMAT from "./Ux.Format";
import COLUMN from "./Ux.Column";
import REDUX from "./Ux.Redux";
import ACTION from "./Ux.Action";
import FIELD from "./Ux.Field";
import DIALOG from "./Ux.Dialog";
import STATE from "./Ux.State";
import DEPEND from "./Ux.Depend";
import ATTRIBUTE from "./Ux.Attribute";
import VALUE from "./Ux.Value";
import HTML from "./Ux.Html";
import PARSER from './Ux.Param';
import AI from './ai/AI';
import Uarr from "./structure/Ux.Uarr";
import Uson from "./structure/Ux.Uson";

export default {
    // 参数解析
    ...PARSER,
    // 字段专用处理
    ...FIELD,
    // 列处理
    ...COLUMN,
    // 关于高阶组件专用函数
    ...HOC,
    // 环境变量
    ...ENV,
    // Ajax函数
    ...AJAX,
    // Log函数
    Logger: LOGGER,
    // 加密解密
    ...ENCRYPT,
    // 随机
    ...RANDOM,
    // 格式化
    ...EXPR,
    // 存储
    ...STORE,
    // 全局数据信息
    ...GLOBAL,
    // 属性处理
    ...PROP,
    // JSX渲染
    ...JSX,
    // OP操作
    ...OP,
    // Sorter
    ...SORTER,
    // ICONS
    ...ICONS,
    // ANT
    ...ANT,
    // Option选项
    ...OPTION,
    // Normalize 标准化
    ...NORM,
    // 类型处理
    ...TYPES,
    // Redux专用
    ...REDUX,
    ...ACTION,
    ...DIALOG,
    // Date日期专用库处理
    ...ATTRIBUTE,
    ...STATE,
    // 依赖项处理
    ...DEPEND,
    // Format格式化处理
    ...FORMAT,
    // Html用法
    ...HTML,
    // Uson/Uarr
    ...VALUE,
    // 新组件用于AI化处理
    ...AI,
    Uarr,
    Uson
};
