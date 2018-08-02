import U from "underscore";
import Random from '../Ux.Random';
import Ai from './AI.Input';
import LayoutType from './AI.Layout.Item';
import Prop from '../Ux.Prop';

const _aiTitle = (item) => {
    if ("string" === typeof item) {
        if (0 <= item.indexOf("=")) {
            const kv = item.split("=");
            const result = {};
            // Ant-Design Form必须
            result.field = Random.randomString(16);
            result[kv[0]] = kv[1];
            item = result;
        }
    }
    return item;
};

const _aiNormalizeItem = (ui = [], eachFun) => {
    ui.forEach((row, rowIndex) => {
        if (U.isArray(row)) {
            row.forEach((cell, cellIndex) => row[cellIndex] = eachFun(cell));
        } else {
            ui[rowIndex] = eachFun(row);
        }
    });
    return ui;
};

const _aiItemConfig = (item = {}, values = {}) => {
    // 初始化optionConfig
    if (!item.optionConfig) {
        item.optionConfig = {};
    }
    if (values.hasOwnProperty(item.field)) {
        item.optionConfig.initialValue = values[item.field];
    }
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
const hookerForm = (ui = []) => {
    // 解析title
    ui = _aiNormalizeItem(ui, _aiTitle);
    return ui;
};

const hookerItem = (item = {}, values = {}, rowConfig = {}) => {
    // 初始化处理
    _aiItemConfig(item, values);
    // 初始化row
    _aiRowConfig(item, rowConfig);
};

const _aiValidator = (item = {}, reference) => {
    if (item.optionConfig) {
        if (!item.optionConfig.hasOwnProperty("rules")) {
            delete item.optionJsx.onFocus;
            delete item.optionJsx.onBlur;
        } else {
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
    }
};

const _aiOptionItem = (item, key, config) => {
    let layoutType = null;
    if (config.layout) {
        layoutType = config.layout;
    } else {
        // 计算
        const window = config.window ? config.window : 1;
        if (1 === window) {
            layoutType = LayoutType[1];
        } else if (1 / 3 === window) {
            layoutType = LayoutType[0.3];
        }
    }
    if (layoutType && layoutType.hasOwnProperty(key)) {
        const optionItem = layoutType[key];
        if (item.optionItem) {
            if (!item.optionItem.style) item.optionItem.style = optionItem.style;
            if (!item.optionItem.labelCol) item.optionItem.labelCol = optionItem.labelCol;
            if (!item.optionItem.wrapperCol) item.optionItem.wrapperCol = optionItem.wrapperCol;
        } else {
            item.optionItem = optionItem;
        }
    }
};

const _aiLayout = (item, layout = {}) => {
    const {cellIndex} = layout;
    // 1.标准布局
    const span = item.span ? item.span : layout.span;
    if (6 === span || 8 === span || 12 === span || 24 === span) {
        const prefix = 24 / span;
        const key = `${prefix}${cellIndex}`;
        _aiOptionItem(item, key, layout);
    } else if (7 === span) {
        const key = `74${cellIndex}`;
        _aiOptionItem(item, key, layout);
    }
};

const hookerRender = (item, renders = {}, layout, refenrece) => {
    // 如果无规则，则省略onFocus/onBlur
    _aiValidator(item, refenrece);
    // 处理布局
    _aiLayout(item, layout);
    // 处理fnRender
    let fnRender = renders[item.field];
    // 如果fnRender没有
    if (!fnRender) {
        // 如果item中存在holder属性
        if (item.field.startsWith("$")) {
            // 特殊Op注入
            if ("$button" === item.field) {
                // Button专用注入
                let renderKey = item.render;
                if (!renderKey) renderKey = 'aiAction';
                fnRender = Ai[renderKey];
            }
        } else {
            // 如果是$button则触发特殊处理
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