import E from "../Ux.Error";
import U from "underscore";
import Debug from "../Ux.Debug";
import Type from "../Ux.Type";
import Obtain from "./Ux.Value.Obtain";

const _findValue = (target = {}, attrPath = []) => {
    E.fxTerminal(2 !== attrPath.length, 10035, target);
    if (2 === attrPath.length) {
        const targetKey = attrPath[0];
        const name = attrPath[1];
        if (targetKey && name) {
            return Obtain.annexObject(target, `$${targetKey}`, attrPath[1]);
        } else {
            console.error(`[Ux] 解析的配置不对，key = ${targetKey}, name = ${name}`);
        }
    } else {
        console.error(`[Ux] 解析表达式有问题，请检查：${target}`);
    }
};

const SEARCHERS = {
    // Bool值
    "BOOL": (value) => Boolean(value),
    // 集合值
    "ENUM": (value) => value.split('`'),
    "FIX": (value) => value,
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
        if (value) {
            const path = value[0];
            const attrPath = path.split('.');
            return _findValue(props, attrPath);
        }
    },
    "STATE": (value, props, state = {}) => {
        if (value) {
            const attrPath = value;
            if (1 === attrPath.length) {
                const attr = attrPath[0];
                return state[`$${attr}`];
            } else {
                return _findValue(state, attrPath);
            }
        }
    }
};
const PARSERS = {
    "DATUM": (kv1 = "") => [kv1.split(',')],
    "PROP": (kv1 = "") => [kv1.split(',')],
    "ENUM": (kv1) => [kv1],
    "FIX": (kv1) => [kv1],
    "STATE": (kv1) => [kv1.split('.')]
};
const _execExpr = (key, expr, consumer) => {
    if ("string" === typeof expr) {
        const kv = expr.split(':');
        E.fxTerminal(2 !== kv.length, 10102, kv);
        // 解析值处理
        let value;
        const parser = PARSERS[kv[0]];
        if (U.isFunction(parser)) {
            value = parser(kv[1]);
        } else {
            value = kv[1].split('.');
        }
        // 执行 consumer
        if (U.isFunction(consumer)) {
            Debug.dgDebug({
                field: key,
                p: kv[0],
                path: value
            }, "[Ux] 特殊解析！", "black");
            consumer(key, kv[0], value);
        }
    }
};
const _itData = (config = {}, consumer = () => {
}) => {
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            const expr = config[key];
            E.fxTerminal("string" !== typeof expr, 10008, key, expr);
            E.fxTerminal(0 > expr.indexOf(':'), 10008, key, expr);
            _execExpr(key, expr, consumer);
        }
    }
};

const valueSearch = (config = {}, props = {}, state = {}) => {
    // 查找根节点
    const result = {};
    _itData(config, (field, p, path) => {
        if (SEARCHERS.hasOwnProperty(p)) {
            result[field] = SEARCHERS[p](path[0], props, state);
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
    valueSearch,
};