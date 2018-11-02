import Datum from "./AI.RxAnt.Datum";
import Util from "../../util";
import Uarr from "../../structure/Ux.Uarr";
import Expr from "../expr/AI.Expr.String";
import Aid from './AI.RxAnt.Aid';
import Prop from "../../prop";
import U from "underscore";
import E from "../../Ux.Error";
import Value from '../../Ux.Value';
import Type from '../../Ux.Type';

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
    let normalized = Uarr.create(options)
        .sort((left, right) => left.left - right.left)
        .convert(config.processor ? config.processor : "code", processor)
        .each(item => item.title = item.code)   // 解决expr不生效的问题
        .mapping(mapping)
        .add('value', applyId)
        .to();
    /**
     * 1. 是否只能选择子节点
     * 2. 在所有的树的字段处理过后执行，最后编译成🌲
     */
    const leafField = config['leafField'];
    if (config['leafField']) {
        let pids = Type.elementVertical(normalized, "pid");
        pids = Value.immutable(pids);
        /**
         * 筛选两种节点
         * 1. 节点主键存在于parentId中
         * 2. 节点中的leaf = true
         */
        normalized = normalized.filter(item => {
            // 是否子节点
            const isLeaf = item[leafField];
            // 是否分支
            const isKeep = pids.contains(item.id);
            return isLeaf || isKeep;
        });
        // 只有叶节点才能选中，其他节点不可以选中
        normalized.forEach(item => item.selectable = item[leafField]);
    }
    return Uarr.create(normalized).tree().to();
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
            // 子项处理
            if (each.children) option.children = each.children;
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