import Datum from "./AI.RxAnt.Datum";
import Util from "../../util";
import Uarr from "../../structure/Ux.Uarr";
import Expr from "../expr/AI.Expr.String";
import Aid from './AI.RxAnt.Aid';
import Prop from "../../prop";
import U from "underscore";
import E from "../../Ux.Error";
import Value from '../../Ux.Value';

const treeOptions = (reference, config = {}) => {
    let options = [];
    if (config.items) {
        options = config.items;
    } else if (config.datum) {
        options = Datum.gainDatum(reference, config);
    }
    const processor = (code, item) => (config.expr) ?
        Util.formatExpr(config.expr, item) : item.label;
    const applyId = (item) => item.value ? item.value : item.id;
    const mapping = Datum.gainTree(config);
    return Uarr.create(options)
        .sort((left, right) => left.left - right.left)
        .convert(config.processor ? config.processor : "code", processor)
        .mapping(mapping)
        .add('value', applyId)
        .tree()
        .to();
};
const options = (reference, config = {}, filter = () => true) => {
    let options = [];
    if (config.items) {
        // 如果存在items的根节点，则直接items处理
        options = Expr.aiExprOption(config.items);
    } else if (config.datum) {
        // 如果存在datum节点，则从Assist/Tabular数据源中读取
        const data = Datum.gainDatum(reference, config, filter);
        const {key = "key", label = "label"} = Datum.parseDatum(config);
        data.forEach(each => {
            const option = {};
            if (each[key]) {
                option['value'] = each[key];
                option['key'] = each[key];
            }
            if (0 <= label.indexOf(":")) {
                option['label'] = Util.formatExpr(label, each);
            } else {
                if (each[label]) {
                    option['label'] = each[label];
                }
            }
            if (each.hasOwnProperty('style')) {
                option['style'] = each.style;
            }
            options.push(option);
        });
    }
    Aid.applyValue(options);
    return options;
};
const dialog = (reference, ...path) => {
    const config = Prop.fromPath.apply(null, [reference].concat(path));
    if (U.isObject(config)) {
        return config;
    } else if ("string" === typeof config) {
        return {content: config};
    } else {
        return {content: E.fxTerminal(true, 10045, config)};
    }
};
const fromTo = (reference, jsx = {}) => {
    const {config = {}} = jsx;
    const normalized = Value.clone(config);
    const fnNorm = (item) => {
        const from = {};
        if (item) {
            if ("string" === typeof item) {
                const fromData = item.split(',');
                from.title = fromData[0] ? fromData[0] : "";
                if (fromData[1]) {
                    from.style = {};
                    from.style.width = fromData[1];
                }
            } else {
                Object.assign(from, item);
            }
        }
        return from;
    };
    if (config.from) normalized.from = fnNorm(config.from);
    if (config.to) normalized.to = fnNorm(config.to);
    jsx.config = normalized;
};
export default {
    treeOptions,
    options,
    dialog,
    fromTo
};