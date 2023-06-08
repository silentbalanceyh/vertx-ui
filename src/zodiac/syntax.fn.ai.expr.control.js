import __Zn from './zero.module.dependency';
import __Pr from './syntax.fn.parse.component';
import __Zt from './syntax.__.fn._.zone';

import __AY_RULE from './syntax.fn.apply.rule';
import __AY_WEB from './syntax.fn.apply.component';
import __AY_ATTR from './syntax.fn.apply.attribute';

import __Ai from './syntax.fn.ai.expr.action';

const __AY = {
    ...__AY_ATTR,
    ...__AY_RULE,
    ...__AY_WEB
}
const _aiMetaColumn = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = __Pr.parseItem(metadata, "column");
        const options = __Zn.valueLadder(rest);
        Object.assign(basic, options);
        __AY.applyColumn(basic);
        item = basic;
    }
    return item;
};
const aiExprColumn = (columns = []) =>
    __Zt.itPipe(columns, (values = []) =>
            __AY.applyColumn(__Pr.parseItem(values, "column")),
        _aiMetaColumn)
        .map(column => __Zn.valueLadder(column)); /* 列的拉平处理 */
const aiExprFilter = (filter = "") =>
    __Pr.parseItem(filter, "filter");


const _aiMetaField = (item = {}) => {
    // field删除key信息，有field代替
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    // span的数值处理
    if (item.span) {
        item.span = __Zn.valueInt(item.span);
    }
    // 验证规则处理
    if (item.optionConfig && item.optionConfig.rules) {
        item.optionConfig.rules = __AY.applyRules(item.optionConfig.rules);
    }
    // Filter专用字段语法，防止逗号冲突
    if (item.field && 0 < item.field.indexOf('`')) {
        // Filter专用语法解析
        item.field = item.field.replace('`', ',');
    }
    // 按钮专用处理
    if (item.optionJsx) {
        item.optionJsx = __Pr.parseAction(item.optionJsx);
    }
    // 解析ajax属性，ListSelector专用
    const ajaxConfig = item.optionJsx && item.optionJsx.config ? item.optionJsx.config : {};
    if (ajaxConfig && ajaxConfig.hasOwnProperty("ajax")) {
        ajaxConfig.ajax = __Ai.aiExprAjax(ajaxConfig.ajax);
    }
    return item;
};
const aiExprField = (literal = "") => {
    const parsed = __Pr.parseItem(literal, "field");
    return _aiMetaField(parsed);
};
const aiExprFieldEx = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = "string" === typeof metadata ? aiExprField(metadata) : {};
        const options = __Zn.valueLadder(rest);
        // 属性追加（不覆盖）
        const final = __Zn.assign(basic, options, 1);
        _aiMetaField(final);
        item = final;
    } else if (item.field) {
        // 没有副作用的解析，让result也支持
        const result = __Zn.valueLadder(item);
        _aiMetaField(result);
        item = result;
    }
    /*
     * 特殊解析，解析 optionJsx.extension 节点，该节点只有 $button 提交按钮存在
     * 且按钮中只处理 [] 类型的 extension
     */
    if (item.optionJsx && item.optionJsx.extension) {
        /*
         * 特殊解析，extension = []
         */
        if (__Zn.isArray(item.optionJsx.extension)) {
            const parsed = [];
            item.optionJsx.extension
                .map(each => __Ai.aiExprOp(each))
                .filter(each => undefined !== each)
                .forEach(each => parsed.push(each));
            // 解析替换处理
            item.optionJsx.extension = parsed;
        }
    }
    return item;
};

const aiExprOption = (options = []) =>
    __Zt.itPipe(options,
        (values = []) => __Pr.parseItem(values, "option"),
        _aiMetaOption)
        .map(__AY.applyValue);

const _aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = __Pr.parseItem(item.metadata, "option");
        if (item.items) each.items = aiExprOption(item.items);
        if (item.children) each.children = aiExprOption(item.children);
        item = each;
    }
    return item;
};
export default {
    aiExprColumn,
    aiExprFilter,
    aiExprField,
    aiExprFieldEx,

    aiExprOption,
}