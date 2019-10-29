// -> jsx.readOnly
import U from "underscore";
import R from "../expression";
import Ut from '../../unity';
import Abs from '../../abyss';
import Ele from '../../element';

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
const cellHyper = (attrs = {}, reference, {
    column = {}, text, record = {}
}) => {
    const config = column["$config"] ? column["$config"] : {};
    attrs.uri = record[config.url];
    attrs.children = text;
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
        /* 专用处理 */
        if ($config.icon) {
            attrs.$icon = $config.icon;
        }
    }
    attrs.$data = Abs.clone(record);
    attrs.$empty = column['$empty'];
};
const cellText = (attrs = {}, reference, {
    column = {}, text
}) => {
    const {width} = column;
    if (0 < width && text) {
        attrs.tooltip = true;
        attrs.width = width;
    }
    attrs.children = text;
};
const cellDatum = (attrs = {}, reference, {
    column = {}, text
}) => {
    const normalized = R.Ant.toUnique(reference, column);
    const {data = [], config = {}} = normalized;
    const {display, value} = config;
    if (U.isArray(text)) {
        /*
         * 多值
         */
        const result = text
            .map(item => Ele.elementUnique(data, value, item))
            .map(item => Ut.valueExpr(display, item, true));
        attrs.children = result.join(',');
    } else {
        /*
         * 单值
         */
        const item = Ele.elementUnique(data, value, text);
        if (item) {
            attrs.children = Ut.valueExpr(display, item, true);
        } else {
            const {$empty} = column;
            if ($empty) {
                attrs.children = $empty;
            } else {
                attrs.children = false;
            }
        }
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
    cellHyper, // HYPERLINK专用
    cellUser, // USER专用，识别创建者
    cellText, // TEXT专用，长文本
    cellDatum, // DATUM专用，识别数据源
};