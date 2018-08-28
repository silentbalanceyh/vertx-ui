import U from "underscore";
import Ai from './AI.Input';
import Calculator from './AI.Layout.Calculator';
import Prop from '../prop/Ux.Prop';
import Expr from './AI.Expr.String';
import Log from '../Ux.Log';

const _aiNormalizeEach = (ui = [], eachFun, eachItemFun = item => item) => {
    ui.forEach((row, rowIndex) => {
        if (U.isArray(row)) {
            row.forEach((cell, cellIndex) => {
                if ("string" === typeof cell) {
                    row[cellIndex] = eachFun(cell);
                } else if ("object" === typeof cell) {
                    row[cellIndex] = eachItemFun(cell);
                }
            });
        } else {
            ui[rowIndex] = eachFun(row);
        }
    });
    return ui;
};
const _aiRowConfig = (item = {}, rowItem = {}) => {
    if (item.optionItem && rowItem && 0 < Object.keys(rowItem).length) {
        if (item.optionItem.style) {
            // 直接合并
            for (const key in rowItem) {
                if (rowItem.hasOwnProperty(key)) {
                    item.optionItem.style[key] = rowItem[key];
                }
            }
        } else {
            item.optionItem.style = rowItem;
        }
    }
};

const _aiValidator = (item = {}, reference) => {
    if (item.optionConfig && item.optionConfig.hasOwnProperty('rules')) {
        // 做纯的Place Holder的计算
        const rules = item.optionConfig.rules.filter(item => item.required);
        if (0 < rules.length) {
            const placeholder = Prop.fromHoc(reference, "placeholder");
            if (!item.optionJsx) {
                item.optionJsx = {};
            }
            if (!item.optionJsx.hasOwnProperty("placeholder")) {
                item.optionJsx.placeholder = placeholder;
            }
        }
    }
};
// 下边是一系列hooker函数
const hookerForm = (ui = []) => {
    // 解析title
    ui = _aiNormalizeEach(ui, Expr.aiExprTitle);
    // 解析field
    ui = _aiNormalizeEach(ui, Expr.aiExprField, Expr.aiMetaField);
    return ui;
};

const hookerItem = (item = {}, values = {}, rowConfig = {}) => {
    // 初始化处理
    Expr.aiExprInit(item, values);
    // 初始化row
    _aiRowConfig(item, rowConfig);
};

const hookerButton = (item = {}, renders) => {
    if ("$button" === item.field) {
        if (renders.hasOwnProperty(item.field)) {
            // 动态渲染专用
            return renders[item.field];
        } else {
            if (!item.optionJsx) item.optionJsx = {};
            item.optionJsx.hidden = !!item.hidden;
            // Button专用注入
            let renderKey = item.render;
            if (!renderKey) renderKey = 'aiAction';
            return Ai[renderKey];
        }
    }
};

const _findRender = (item, renders, entity) => {
    let fnRender = renders[item.field];
    if (!fnRender) {
        if (entity && item.field && item.field.startsWith("children")) {
            const hitted = item.field.split(`.${entity}.`)[1];
            if (hitted && "string" === typeof hitted) {
                fnRender = renders[hitted];
            }
        }
    }
    return fnRender;
};

const hookerRender = (item, renders = {}, layout = {}, refenrece) => {
    // 如果无规则，则省略onFocus/onBlur
    _aiValidator(item, refenrece);
    // 处理布局
    Calculator.calculateLayout(item, layout);
    // 处理fnRender
    let fnRender = _findRender(item, renders, layout.entity);
    // 如果fnRender没有
    Log.render(2, item, fnRender);
    if (!fnRender) {
        // 如果item中存在holder属性
        if (item.field && item.field.startsWith("$")) {
            // 特殊Op注入, 如果是$button则触发特殊处理
            fnRender = hookerButton(item, renders);
        } else {
            if (!item.hasOwnProperty('holder')) {
                // 设置item中的render属性
                let renderKey = item.render;
                if (!renderKey) renderKey = 'aiInput';
                fnRender = Ai[renderKey];
            }
        }
    }
    return fnRender;
};

const hookerCol = (item) => {
    const style = {};
    if (item.optionItem && item.optionItem.style) {
        if (item.optionItem.style.hasOwnProperty('height')) {
            style.height = item.optionItem.style.height;
        }
    }
    return style;
};
export default {
    hookerCol,
    hookerForm,
    hookerItem,
    hookerRender
}