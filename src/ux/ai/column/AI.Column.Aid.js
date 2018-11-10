import Value from '../../value';
// Expr
import AiValue from "../expr/AI.Expr.Value";
import AiExpr from "../expr/AI.Expr.String";
// Xt
import Xt from '../../xweb';

import U from "underscore";
// jsx.style -> style中
// 「静态」读取jsx中的风格到当前风格中
const onStyle = (attrs = {}, reference, {
    jsx = {}
}) => {
    // 将jsx中的style拷贝到
    attrs.style = jsx.style ? jsx.style : {};
};

const onUnit = (attrs = {}, reference, {
    column = {}
}) => {
    // 解析items
    const config = column['$config'] ? column['$config'] : {};
    if (config.hasOwnProperty('unit')) {
        attrs.addonAfter = config.unit;
    }
};

const onChangeUnit = (attrs = {}, reference, {
    column = {},
    normalize   // 格式化专用
}) => Xt.xt3ChangeUnit(reference, {field: column.dataIndex, normalize});

const onOptions = (attrs = {}, reference, {
    column = {},
}) => {
    // 解析items
    const config = column['$config'] ? column['$config'] : {};
    attrs.items = AiExpr.aiExprOption(config.items);
};
const onRows = (attrs = {}, reference, {
    column = {},
}) => {
    const config = column['$config'] ? column['$config'] : {};
    const rows = config ? config["rows"] : 2;
    attrs.rows = rows;
};
const jsxChild = (column = {}, record = {}, fnRender) => {
    // config中是否配置了childOnly
    const {$config = {}} = column;
    if ($config['childOnly']) {
        // 如果是childOnly则只有children = [] > 0 时渲染
        if (record.children && 0 < record.children.length) {
            return false;
        } else return U.isFunction(fnRender) ? fnRender() : false;
    } else return U.isFunction(fnRender) ? fnRender() : false;
};
const jsxConnect = (fnStatic, fnDynamic, fnRender) => {
    return (reference, column = {}, jsx) => {
        // 穿透引用
        const channel = {};
        // 执行静态处理函数
        const attrs = fnStatic(reference, {column, jsx}, channel);

        return (text, record = {}, index) => {
            // 执行动态处理函数
            fnDynamic(attrs, reference, {jsx, column, text, record, index}, channel);
            // 执行渲染专用函数
            const {children, ...rest} = attrs;
            return jsxChild(column, record, () => fnRender(rest, children));
        };
    };
};

// -> jsx.readOnly
const outReadOnly = (attrs = {}, reference, {
    jsx = {}, column = {}
}) => {
    attrs.readOnly = false;
    // 1.检查jsx的readOnly是不是存在
    if (jsx.hasOwnProperty('readOnly')) {
        const {readOnly = false} = jsx;
        attrs.readOnly = readOnly;
    }
    // 2.其次检查$config中是否设置了readOnly
    const {$config = {}} = column;
    if ($config.hasOwnProperty("readOnly")) {
        // 如果整体是false，则以$config.readOnly节点为主
        if (!attrs.readOnly) {
            attrs.readOnly = !!$config.readOnly;
        }
    }
};
const outDisabled = (attrs = {}, reference, {
    jsx = {}
}) => {
    attrs.disabled = false;
    if (jsx.hasOwnProperty('readOnly')) {
        attrs.disabled = jsx.readOnly;
    }
};
// -> $config.mode
// 「动态」读取序号，依赖value中的值（每次渲染时需要计算）
const outSeq = (attrs = {}, reference, {
    jsx = {}, column = {}, text
}) => {
    const {$config = {}} = column;
    attrs.children = Value.sequence(text, $config.mode);
};
const outTo = (attrs = {}, reference, {
    jsx = {}, column = {}, text, record = {},
}) => {
    const {$config = {}} = column;
    let label = text;
    // 转换前提是包含了to相关配置
    if ($config.to) {
        label = record[$config.to];
    }
    attrs.children = label;
};
export default {
    // ------- 静态
    onStyle,    // 设置渲染的span标签的风格
    onChangeUnit, // 生成函数用于处理底层的「索引」专用结果
    onOptions,  // 设置专用的options解析
    onRows, // 设置TextArea专用的rows属性
    onUnit, // 单位设置，unit = ￥
    // ------- 动态：根据值有所改变
    outReadOnly, // 设置当前组件的"只读"属性
    outDisabled, // 设置当前组件的"禁用"属性
    outSeq,     // 根据不同的mode设置序号字段以及序号字段的相关规则
    outTo,   // Vector专用

    // ------- 初始化
    initEmpty: () => ({}),
    initDynamic: (params = {}) => AiValue.applyDynamic(params.column),
    initConfig: () => (params = {}) => params.column["$config"] ? params.column["$config"] : {},

    // ------- jsx渲染流程变化
    jsxChild,
    jsxConnect
};