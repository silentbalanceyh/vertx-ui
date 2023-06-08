import __V_DEFINITION from './syntax.__.v._.attribute.control';
import __Zn from './zero.module.dependency';

import __AY_RULE from './syntax.fn.apply.rule';
import __AY_WEB from './syntax.fn.apply.component';
import __AY_ATTR from './syntax.fn.apply.attribute';

const __AY = {
    ...__AY_ATTR,
    ...__AY_RULE,
    ...__AY_WEB
}

const parseItem = (kvs = [], key) => {
    let item = {};
    if ("string" === typeof kvs || __Zn.isArray(kvs)) {
        kvs = __AY.applyArray(kvs);
        if (__V_DEFINITION[key]) {
            const config = __V_DEFINITION[key];
            // 基本属性解析
            item = __AY.applyInput(item, config, kvs);
            // 检查connectId：Button专用，其他的不影响
            __AY.applyConnect(item);
            // style计算，所有组件通用
            __AY.applyStyle(item);
            // 额外的键值对
            __AY.applyKv(item, config, kvs);
            // 补上key（无key的时候处理）
            __AY.applyKey(item);
        }
    } else {
        item = __Zn.clone(kvs);
    }
    return item;
};
const parseOp = (button = "") => {
    if ("string" === typeof button) {
        const splitted = button.split(',');
        if (1 === splitted.length) {
            const item = {};
            item.id = button;
            item.key = button;
            item.text = "";
            return item;
        } else {
            const item = parseItem(button, "bind");
            if (!item.id) item.id = item.key;
            return item;
        }
    } else {
        return button;
    }
};
const parseAction = (jsx = {}) => {
    ["bind"].forEach(field => {
        if (jsx[field]) {
            const binds = __Zn.isArray(jsx[field]) ? jsx[field] : [];
            const converted = [];
            binds.forEach(item => converted.push(parseOp(item)));
            jsx[field] = converted;
        }
    });
    return jsx;
};
export default {
    parseItem,
    parseAction,
}