import Type from "../Ux.Type";
import E from "../Ux.Error";

const SEARCHERS = {
    // Bool值
    "BOOL": (value) => Boolean(value),
    // 集合值
    "ENUM": (value) => value.split('`'),
    "OPERATOR": (value) => "AND" === value,
    // 从Tabular/Assist抓取数据
    "DATUM": (value, props) => {
        const source = value[0];
        const filters = {};
        for (let idx = 1; idx < value.length; idx++) {
            const term = value[idx];
            if ("string" === typeof term) {
                const kv = term.split('=');
                filters[kv[0]] = kv[1];
            }
        }
        const unique = Type.elementUniqueDatum({props}, source, filters);
        return unique ? unique.key : undefined;
    },
    "PROP": (value, props) => {
        const path = value[0];
        const attrPath = path.split('.');
        E.fxTerminal(2 !== attrPath.length, 10035, path);
        if (2 === attrPath.length) {
            const targetKey = attrPath[0];
            const dataObj = props[`$${targetKey}`];
            if (dataObj && dataObj.is()) {
                const to = attrPath[1];
                return dataObj._(to);
            }
        }
    }
};

const valueSearch = (config = {}, props = {}) => {
    // 查找根节点
    const result = {};
    Type.itData(config, (field, p, path) => {
        if (SEARCHERS.hasOwnProperty(p)) {
            result[field] = SEARCHERS[p](path[0], props);
        } else {
            const propName = `$${p}`;
            if (props[propName]) {
                const dataObject = props[propName];
                const value = dataObject._(path);
                if (value) {
                    result[field] = value;
                } else {
                    console.info(`[ Ux ] 检索节点：${propName}，检索路径：${path}，值：${value}`);
                }
            }
        }
    });
    return result;
};

export default {
    valueSearch
}