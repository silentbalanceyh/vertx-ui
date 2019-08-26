import Prop from "../../prop";
import U from "underscore";
import E from "../../Ux.Error";
import Value from '../../Ux.Value';
import Type from '../../Ux.Type';
import Datum from './AI.RxAnt.Datum';
import Uarr from '../../structure/Ux.Uarr';

/**
 * 解析树配置
 * @param config
 * @private
 */
const _parseTree = (config = {}) => {
    let tree = {};
    if ("string" === typeof config.tree) {
        const reverted = Value.valuePair(config.tree);
        Object.keys(reverted).forEach(key => tree[reverted[key]] = key);
    } else {
        // 解析结果直接从config的tree中提取
        // from = to
        tree = config.tree;
    }
    // 设置配置默认值
    if (!tree.id) tree.id = "id";
    if (!tree.title) tree.title = "label";   // 唯一的不同点
    if (!tree.pid) tree.pid = "pid";
    if (!tree.value) tree.value = "value";
    if (!tree.leaf) tree.leaf = "leaf";
    // 再反转一次
    const normalized = {};
    Object.keys(tree).forEach(key => normalized[tree[key]] = key);
    return normalized;
};

const _parseLeaf = (normalized = [], config = {}) => {
    const leafField = config['leafField'];
    if (config['leafField']) {
        let pids = Type.elementVertical(normalized, "pid");
        pids = Value.immutable(pids);
        /**
         * 筛选两种节点
         * 1. 节点主键存在于parentId中
         * 2. 节点中的leaf = true
         **/
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
    return normalized;
};

const treeOptions = (reference, config = {}) => {
    /**
     * 1.读取树型结构数据源基本信息
     */
    let options = Datum.getSource(reference, config);
    /**
     * 2.规范化处理
     */
    const tree = _parseTree(config);
    let normalized = Uarr.create(options)
        .mapping(tree)
        .to();
    /**
     * 3.设置叶节点专用属性，在normalized中处理叶节点
     */
    normalized = _parseLeaf(normalized, config);
    /**
     * 4.构造树形结构
     */
    return Uarr.create(normalized).tree().to();
};
const options = (reference, config = {}, filter = () => true) =>
    Datum.getSource(reference, config, filter);
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