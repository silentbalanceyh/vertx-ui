// -> jsx.readOnly
import U from "underscore";
import R from "../expression";
import Ut from '../../unity';
import Abs from '../../abyss';
import Ele from '../../element';

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
    attrs.children = Abs.sequence(text, $config.mode);
};
const _outTree = (column = {}, record = {}, fnCallback, fnElse) => {
    const {$config = {}} = column;
    const {tree} = $config;
    if (tree) {
        // 树模式
        if (!record.children || 0 === record.children.length) {
            fnCallback();
        } else {
            if (fnElse) fnElse();
        }
    } else {
        // 平行模式
        fnCallback();
    }
};
const outCurrency = (attrs = {}, reference, {
    jsx = {}, column = {}, text, record,
}) => {
    const {$config = {}} = column;
    const {unit = "￥"} = $config;
    _outTree(column, record, () => {
        attrs.children = `${unit}${text}`;
    }, () => attrs.children = false);
};
const outMultiple = (attrs = {}, reference, {
    jsx = {}, column = {}, text, record = {},
}) => {
    const {$config = {}} = column;
    const {elements = [], unit = "￥"} = $config;
    _outTree(column, record, () => {
        const elementValues = elements.map(field => Ele.valueFloat(record[field]));
        const result = Ut.mathMultiplication.apply(this, [1].concat(elementValues));
        attrs.children = `${unit}${result}`;
    }, () => attrs.children = false);
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
        value = Ele.valueTime(value);
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
    const item = Ele.valueIcon(literal);
    if (item && U.isObject(item)) {
        Object.assign(attrs, item);
    }
};
const cellPercent = (attrs = {}, reference, {
    text,
}) => {
    attrs.children = Ut.formatPercent(text);
};
const cellMapping = (attrs = {}, reference, {
    column = {}, text,
}) => {
    const mapping = column['$mapping'];
    if (mapping && text) {
        /*
         * valueLadder 中符号冲突
         * 1）.号需要转换成 ` 来处理 literal 中的值
         * 2）因为值中可能包含 . 号
         */
        let literal = "";
        if (0 < text.indexOf('.')) {
            const reg = new RegExp("\\.", "g");
            const key = text.replace(reg, '`');
            literal = mapping[key];
        } else {
            literal = mapping[text];
        }
        if (literal && 0 < literal.indexOf(',')) {
            attrs.icon = R.aiExprIcon(literal);
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
        attrs.children = literal.text;
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
            attrs.children = Ut.formatDate(text, column["$format"]);
        }
    } else {
        attrs.children = Ut.formatDate(text, column["$format"]);
    }
};
const cellCurrency = (attrs = {}, reference, {
    column = {}, text
}) => {
    const unit = column['$unit'] ? column['$unit'] : "￥";
    attrs.children = unit + Ut.formatCurrency(text);
};
const cellExpr = (attrs = {}, reference, {
    column = {}, text, record = {}
}) => {
    // 让0过掉
    if (undefined !== text && "" !== text) {
        attrs.children = Ut.formatExpr(column['$expr'], {
            ...record, value: text,
        }, true);
    } else {
        attrs.children = false;
    }
};
const cellUser = (attrs = {}, reference, {
    column = {}, text, record = {}
}) => {
    const {$config} = column;
    if ($config && text) {
        attrs.config = Abs.clone($config);
        attrs.$key = text;
    }
    attrs.$data = Abs.clone(record);
    attrs.$empty = column['$empty'];
};
const outOrigin = (attrs = {}, reference, {
    column = {}, record = {}
}) => {
    const {$config = {}} = column;
    const expr = Ut.formatObject($config.origin, true);
    const {origin} = reference.state ? reference.state : {};
    // 根节点
    const source = expr.source;
    if (origin) {
        const fieldData = origin[source];
        if (fieldData) {
            // 根据字段中的某个key读取
            const field = expr.field;
            const hitKey = record[field];
            let items = fieldData[hitKey];
            if (!U.isArray(items)) items = [];
            // 设置attrs
            attrs.items = R.Ant.toOrigin(items, expr);
        }
    }
};
const outFilter = (attrs = {}, reference, {
    column = {}, record = {}
}) => {
    const {$config = {}} = column;
    const expr = Ut.formatObject($config.datum, true);
    const items = Abs.clone(attrs.items);
    if (expr.filter && record[expr.filter]) {
        const $data = Abs.immutable(record[expr.filter]);
        attrs.items = items.filter(item => $data.contains(item.key));
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
    cellUser, // USER专用，识别创建者
    // ------- 动态：根据值有所改变
    outReadOnly, // 设置当前组件的"只读"属性
    outDisabled, // 设置当前组件的"禁用"属性
    outSeq,     // 根据不同的mode设置序号字段以及序号字段的相关规则
    outCurrency, // 货币渲染专用，注意Tree的树节点
    outMultiple,   // 求乘积处理，注意Tree的树节点
    outTo,   // Vector专用
    outDate,  // Moment时间格式专用转换
    outOrigin, // 处理$config.origin专用处理
    outFilter,	// 处理$config.datum中的filter
};