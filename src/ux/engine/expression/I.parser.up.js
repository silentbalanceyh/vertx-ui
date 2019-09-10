// 导入第三方库
import U from "underscore";
// 导入当前目录
import Apply from "./O.apply";
import DEFINITION from "./I.definition";
// 导入外层
import Abs from '../../abyss';

const parseItem = (kvs = [], key) => {
    let item = {};
    if ("string" === typeof kvs || U.isArray(kvs)) {
        kvs = Apply.applyArray(kvs);
        if (DEFINITION[key]) {
            const config = DEFINITION[key];
            // 基本属性解析
            item = Apply.applyItem(item, config, kvs);
            // 补上key（无key的时候处理）
            Apply.applyKey(item);
            // 检查connectId：Button专用，其他的不影响
            Apply.applyConnect(item);
            // style计算，所有组件通用
            Apply.applyStyle(item);
            // 额外的键值对
            Apply.applyKv(item, config, kvs);
        }
    } else {
        item = Abs.clone(kvs);
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
            const binds = U.isArray(jsx[field]) ? jsx[field] : [];
            const converted = [];
            binds.forEach(item => converted.push(parseOp(item)));
            jsx[field] = converted;
        }
    });
    return jsx;
};
export default {
    parseAction,
    parseItem
}