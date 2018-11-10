// -> jsx.readOnly
import Value from "../../value";
import U from "underscore";
import Util from "../../util";
import Ai from "../AI";

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
const outDate = (attrs = {}, reference, {
    text,
}) => {
    let value = text;
    if (value) {
        value = Value.convertTime(value);
    } else {
        value = null;
    }
    attrs.value = value;
};
const cellLogical = (attrs = {}, reference, {
    column = {}, text,
}) => {
    const {$mapping = {}} = column;
    const literal = text ? $mapping["true"] : $mapping["false"];
    const item = Value.valueIcon(literal);
    if (item && U.isObject(item)) {
        Object.assign(attrs, item);
    }
};
const cellPercent = (attrs = {}, reference, {
    text,
}) => {
    attrs.children = Util.fmtPercent(text);
};
const cellMapping = (attrs = {}, reference, {
    column = {}, text,
}) => {
    const mapping = column['$mapping'];
    if (mapping) {
        const literal = mapping[text];
        if (literal && 0 < literal.indexOf(',')) {
            attrs.icon = Ai.aiExprIcon(literal);
        } else {
            attrs.children = literal;
        }
    } else {
        attrs.children = text;
    }
};
const cellIcon = (attrs = {}, reference, {
    column = {}, text
}) => {
    const mapping = column['$mapping'] ? column['$mapping'] : {};
    const literal = mapping[text];
    if (U.isObject(literal)) {
        attrs.icon = literal.icon;
        attrs.style = literal.style ? literal.style : false;
        attrs.children = text;
    } else {
        attrs.children = literal;
    }
};
const cellDate = (attrs = {}, reference, {
    column = {}, text
}) => {
    if (column['$empty']) {
        if (!text) {
            attrs.children = false;
        } else {
            attrs.children = Util.formatDate(text, column["$format"]);
        }
    } else {
        attrs.children = Util.formatDate(text, column["$format"]);
    }
};
const cellCurrency = (attrs = {}, reference, {
    column = {}, text
}) => {
    const unit = column['$unit'] ? column['$unit'] : "￥";
    attrs.children = unit + Util.fmtCurrency(text);
};
const cellExpr = (attrs = {}, reference, {
    column = {}, text, record = {}
}) => {
    if (text) {
        attrs.children = Util.formatExpr(column['$expr'], {
            ...record, value: text,
        });
    } else {
        attrs.children = false;
    }
};
export default {
    // ------- 动态：直接表格使用
    cellLogical, // LOGICAL专用，只识别true/false
    cellPercent, // PERCENT专用，只识别数字
    cellMapping, // MAPPING专用，只识别mapping专用
    cellDate, // DATE专用，识别日期专用
    cellCurrency, // CURRENCY专用，识别货币
    cellExpr, // EXPR专用，识别表达式
    cellIcon, // ICON专用，识别Icon图标
    // ------- 动态：根据值有所改变
    outReadOnly, // 设置当前组件的"只读"属性
    outDisabled, // 设置当前组件的"禁用"属性
    outSeq,     // 根据不同的mode设置序号字段以及序号字段的相关规则
    outTo,   // Vector专用
    outDate,  // Moment时间格式专用转换
};