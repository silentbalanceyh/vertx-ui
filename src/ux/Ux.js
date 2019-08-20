import ENV from "./Ux.Env";
import AJAX from "./ajax/Ux.Ajax";
import JSX from "./Ux.Jsx";
import NORM from "./Ux.Normalize";
import TYPES from "./Ux.Type";
import TREES from "./Ux.Tree";
import COLUMN from "./Ux.Column";
import DIALOG from "./Ux.Dialog";
import VALUE from "./Ux.Value";
import AI from './ai/AI';
import FORM from './Ux.Form';
import E from './Ux.Error';
import G from './draw';
import D from './monitor';

import Util from './util';
import Prop from './prop';
import Fun from './fun';
import Op from './op';
import System from './system';
import Trigger from './trigger';
import Terminal from './terminal';
import Structure from './structure';
import XT from './xweb';
import Jsx from './jsx';
import Dg from './Ux.Debug';
import Mock from './mock';
import Validator from './validator';

const exported = {
    // ...CONTROL,
    ...Jsx,
    // ...Mock专用
    ...Mock,
    /**
     *  XT系列组件用于替换掉CONTROL中的自定义组件对应的方法
     *  将J系列的方法全部替换成新版
     */
    ...XT,
    // 优化Form处理
    ...FORM,
    // 列处理
    ...COLUMN,
    // 环境变量
    ...ENV,
    // Ajax函数
    ...AJAX,
    // Log函数
    Logger: D.Logger,
    E,
    // JSX渲染
    ...JSX,
    // Normalize 标准化
    ...NORM,
    // 类型处理
    ...TYPES,
    // 树形
    ...TREES,
    // Redux专用
    ...DIALOG,
    // Uson/Uarr
    ...VALUE,
    // 新组件用于AI化处理
    ...AI,
    /**
     * Uson - 数据结构
     * Uarr = 数据结构
     */
    ...Structure,
    /**
     * 触发控件专用
     */
    ...Trigger,
    /**
     * Global全局数据处理
     */
    ...System,
    /**
     * Action Run专用,
     * 按钮Connect专用
     * On绑定专用
     * pipe 专用方法
     */
    ...Op,
    /**
     * rdx - 系列方法
     * rt - Ajax响应处理专用方法
     * ir - 分页列表系列方法
     * parse - 解析专用
     */
    ...Fun,
    /**
     * Attribute：属性处理
     * Field：异步验证
     * Form：Ant Design Form中的相关操作
     * Hoc：高阶组件专用方法
     * State：状态处理
     * Prop：属性处理
     * Validator：验证器处理
     */
    ...Prop,
    /**
     * Encrypt：加密库
     * Format：Format格式化
     * Random：随机数生成
     * Sorter：列排序专用
     * Expr：表达式格式化
     * Sign：签名处理
     * Html：专用Html属性处理
     * Icon：图标处理
     */
    ...Validator,
    ...Util,
    ...Terminal,
    // 图专用函数
    G,
    // 调试专用
    D,
};
// 日志处理
Dg.dgReport(exported, [
    "「g2/g6图库」 - Ux.G,#339",
    "「调试专用库」 - Ux.D,#069",
    "「彩色日志库」 - Ux.Logger,#099",
    "「错误信息库」 - Ux.E,#f03",
    "「错误」验证函数 - Ux.,#903,verify",
    "「错误」中断函数 - Ux.,#903,fx",
    "「远程」Ajax专用 - Ux.,#360,ajax",
    "「远程」微服务专用 - Ux.,#360,micro",
    "「远程」Rx模式 - Ux.,#360,rx",
    "「全局」全局判断 - Ux.,#399,is",
    "「全局」转换/跳转 - Ux.,#399,to",
    "「全局」存储配置 - Ux.,#399,store",
    "「全局」本地存储 - Ux.,#399,OBJECT",
    "「基础」异步验证 - Ux.,#c60,async",
    "「基础」表单专用 - Ux.,#c60,form",
    "「基础」配置读取 - Ux.,#c60,from",
    "「基础」子项目处理 - Ux.,#c60,item",
    "「基础」特殊挂载 - Ux.,#c60,on",
    "「基础」快速处理 - Ux.,#c60,rapit",
    "「基础」属性转换 - Ux.,#c60,to",
    "「基础」其他函数 - Ux.,#c60,OTHER:async`form`from`item`on`rapit`to",
    "「工具」编码加密 - Ux.,#039,encrypt",
    "「工具」解码解密 - Ux.,#039,decrypt",
    "「工具」表格列格式化 - Ux.,#039,fmt",
    "「工具」格式化 - Ux.,#039,format",
    "「工具」Html专用 - Ux.,#039,html",
    "「工具」随机数 - Ux.,#039,random",
    "「工具」列排序 - Ux.,#039,sorter",
    "「工具」其他函数 - Ux.,#039,OTHER:encrypt`decrypt`fmt`format`html`random`sorter",
    "「单向」查询函数 - Ux.,#603,ir",
    "「单向」解析函数 - Ux.,#603,parse",
    "「单向」Redux处理函数 - Ux.,#603,rdx",
    "「单向」Epic回调处理 - Ux.,#603,rx",
    "「组件」Xt组件动态类 - Ux.,#660,OBJECT",
    "「组件」Xt组件事件绑定函数 - Ux.,#660,xt2",
    "「组件」Xt组件初始化函数 - Ux.,#660,xtInit",
    "「组件」Xt组件Reactive流程函数 - Ux.,#660,xtRx",
    "「组件」Xt组件Reactive流程函数 - Ux.,#660,xtTo",
    "「组件」Xt组件常用函数 - Ux.,#660,OTHER:xt2`xtInit`xtRx`xtTo",
    "「界面」列处理函数 - Ux.uiXXX,#363",
    "「标准」Normalize标准化 - Ux.XXX",
    "「界面」窗口显示函数 - Ux.,#096,show",
    "「界面」窗口效果 - Ux.,#096,OTHER:show",
    "「界面」Jsx渲染函数 - Ux.,black,jsx",
    "「界面」快速模式函数 - Ux.,black,raft",
    "「界面」操作绑定函数 - Ux.,black,rt",
    "「界面」视图模式函数 - Ux.,black,view",
    "「界面」其他函数 - Ux.,black,OTHER:jsx`raft`rt`view",
    "「智能」高阶渲染 - Ux.,#c33,ai2",
    "「智能」属性解析 - Ux.,#c33,aiExpr",
    "「智能」图渲染 - Ux.,#c33,aiChart",
    "「智能」纯组件渲染 - Ux.,#c33,aiInput",
    "「智能」其他函数 - Ux.,#c33,OTHER:ai2`aiExpr`aiChart`aiInput",
    "「全局」UI触发控件 - Ux.Trigger,#399",
    "「全局」数据结构 - Ux.Uxxx,#399",
    "「原子」数组计算 - Ux.,#693,element",
    "「原子」遍历计算 - Ux.,#693,it",
    "「原子」🌲计算 - Ux.,#693,tree",
    "「原子」数学运算 - Ux.,#039,math",
    "「原子」值处理 - Ux.,#039,value",
    "「原子」🌲子节点运算 - Ux.,#039,OBJECT",
    "「原子」字符串处理 - Ux.,#039,string",
    "「原子」数组处理 - Ux.,#039,array",
    "「原子」判断值处理 - Ux.,#039,is",
    "「原子」核心全局处理 - Ux.,#c33,OTHER:math`value`Child`string`array`is",
    "「全局」数据处理 - Ux.,#399,data",
    "「全局」Reactive事件 - Ux.,#399,rx",
    "「全局」函数式UI - Ux.,#399,aui",
    "「全局」核心类 - Ux.,#399,OBJECT",
    "「全局」其他全局 - Ux.,#399,OTHER:rx`aui"
], [
    G,  // 图库
    D,  // 调试库
    D.Logger, // 日志库
    E,  // 错误信息专用库
    Terminal, // 错误中断专用库
    Terminal, // 错误中断专用库
    AJAX, // 远程调用库
    AJAX, // 远程调用库
    AJAX, // 远程调用库
    System, // 全局处理函数
    System, // 全局处理函数
    System, // 全局处理函数
    System, // 全局处理函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Prop, // Prop属性基础函数
    Util, // 工具类函数
    Util, // 工具类函数
    Util, // 工具类函数
    Util, // 工具类函数
    Util, // 工具类函数
    Util, // 工具类函数
    Util, // 工具类函数
    Util, // 工具类函数
    Fun, // 基础函数
    Fun, // 基础函数
    Fun, // 基础函数
    Fun, // 基础函数
    XT, // Xt自定义专用函数
    XT, // Xt自定义专用函数
    XT, // Xt自定义专用函数
    XT, // Xt自定义专用函数
    XT, // Xt自定义专用函数
    XT, // Xt自定义专用函数
    COLUMN, // 列处理函数
    NORM, // Normalize标准化
    DIALOG, // 窗口专用函数
    DIALOG, // 窗口专用函数
    {...Jsx, ...JSX},  // Jsx新专用函数
    {...Jsx, ...JSX, ...FORM},  // Jsx新专用函数
    {...Jsx, ...JSX},  // Jsx新专用函数
    {...Jsx, ...JSX},  // Jsx新专用函数
    {...Jsx, ...JSX},  // Jsx新专用函数
    AI, // Ai组件专用函数
    AI, // Ai组件专用函数
    AI, // Ai组件专用函数
    AI, // Ai组件专用函数
    AI, // Ai组件专用函数
    Trigger, // UI触发控件函数
    Structure, // 核心数据结构
    TYPES, // 基础类型处理
    TYPES, // 基础类型处理
    TREES, // 基础类型处理
    VALUE, // 值处理函数
    VALUE, // 值处理函数
    VALUE, // 值处理函数
    VALUE, // 值处理函数
    VALUE, // 值处理函数
    VALUE, // 值处理函数
    VALUE, // 值处理函数
    ENV, // 环境变量
    ENV, // 环境变量
    ENV, // 环境变量
    ENV, // 环境变量
    ENV, // 环境变量
    // CONTROL, // J开头专用
]);
export default exported;
