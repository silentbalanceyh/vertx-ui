import ajax from "./ajax";
import abs from "./abyss";
import E from "./error";
import develop from "./develop";
import element from "./element";
import engine from "./engine";
import entity from "./entity";
import unity from "./unity";
import graphic from "./graphic";

const config = {
    E: [
        "「错误」（开发模式）中断函数 - Ux.,red,fx",
        "「错误」（开发模式）map单个Item专用 - Ux.,red,map",
        "「错误」（开发模式）打印库日志 - Ux.,#369,report"
    ],
    develop: [
        "「开发」（开发模式）调试函数 - Ux.,#eb2f96,dg"
    ],
    abs: [
        "「判断」底层检查 - Ux.,#6E8B3D,is",
        "「全局」全局迭代 - Ux.,#399,it",
        "「全局」统一函数 - Ux.,#399,OTHER:is`it",
    ],
    element: [
        "「下层」值处理 - Ux.,#473C8B,value",
        "「下层」数组计算 - Ux.,#693,element",
        "「下层」二义性 - Ux.,#693,ambiguity",
    ],
    entity: [
        "「内核」Redux状态进出 - Ux.,#660,data",
        "「内核」Redux行为创建 - Ux.,#660,createAction",
        "「内核」@zero辅助 - Ux.,#660,rx",
        "「内核」常用数据结构 - Ux.,#660,U",
    ],
    graphic: [
        "「g2/g6图库」 - Ux.,#339,draw",
    ],
    unity: [
        "「工具」Redux状态树写入 - Ux.,#660,to",
        "「基础」核心类 - Ux.,#B03060,OBJECT",
        "「工具」连接专用 - Ux.,#039,connect",
        "「工具」编码加密 - Ux.,#039,encrypt",
        "「工具」解码解密 - Ux.,#039,decrypt",
        "「工具」格式化 - Ux.,#039,format",
        "「工具」表单处理 - Ux.,#039,form",
        "「工具」Html元素交互 - Ux.,#039,html",
        "「判断」上层数据（读取） - Ux.,#6E8B3D,is",
        "「工具」数学函数 - Ux.,#8B1A1A,match",
        "「工具」随机函数 - Ux.,#8B1A1A,random",
        "「工具」表格列排序 - Ux.,#8B1A1A,sorter",
        "「工具」全局存储 - Ux.,#039,store",
        "「工具」结构转换 - Ux.,#039,to",
        "「上层」值处理 - Ux.,#473C8B,value",
        "「安全」令牌读取 - Ux.,#039,token",
        "「安全」数字签名 - Ux.,#039,signature",
    ],
    ajax: [
        "「远程」Ajax专用 - Ux.,#360,ajax",
        "「远程」微服务专用 - Ux.,#360,micro",
        "「远程」Rx模式 - Ux.,#360,rx",
        "「远程」异步验证 - Ux.,#360,async",
        "「本地」消息回调 - Ux.,#360,message"
    ],
    engine: [
        "「上层」数组计算 - Ux.,#693,element",
        "「上层」特殊转换 - Ux.,#660,to",
        "「内核」核心类 - Ux.,#B03060,OBJECT",
        "「内核」属性解析器（上层） - Ux.,#B8860B,aiExpr",
        "「内核」属性解析器（下层） - Ux.,#556B2F,apply",
        "「内核」交互式组件（2阶） - Ux.,#B8860B,ai2",
        "「内核」Ant/交互式组件（1阶） - Ux.,#B8860B,OTHER:ai2`aiExpr",
        "「内核」复杂配置生成 - Ux.,#CD3333,config",
        "「内核」统一配置生成 - Ux.,#CD3333,cap",
        "「内核」配置读取 - Ux.,#CD3333,from",
        "「内核」数据读取 - Ux.,#CD3333,on",
        "「内核」配置解析 - Ux.,#CD3333,parse"
    ]
};

const input = {
    E,
    develop,
    abs,
    element,
    entity,
    graphic,
    unity,
    ajax,
    engine,
};
export default () => E.reportExported(input, config);