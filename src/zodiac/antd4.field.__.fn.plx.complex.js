import __Zn from "zone";
import __AiEx from './syntax.fn.ai.expr.control';
import __DATUM_CONSUMER from './source.datum.fn.on.consumer';
import __DATUM_PARSE from './source.datum.fn.parse.data';
import __TREE_TO from './tree.fn.to.configuration';
import __FORM from './form.fn.form.action';
import Uarr from './vow.c.u.array';

const plxUnique = (reference, config = {}) => {
    let source = {};
    if (__Zn.isArray(config.items)) {
        source.data = __AiEx.aiExprOption(config.items);
        source.config = {
            display: 'label',// 固定值处理
            value: 'key'// 固定值处理
        };
    } else {
        let datum;
        if (config.datum) {
            datum = config.datum;
        } else if (config['$datum']) {
            datum = config['$datum']
        }
        if (datum) {
            const config = "string" === typeof datum ?
                __Zn.formatObject(datum, true) : datum;
            /*
             * 计算 list
             */
            if (config) {
                source.data = __DATUM_CONSUMER.onDatum(reference, config.source);
            } else {
                source.data = [];
            }
            /*
             * 兼容处理 label 优先，其次 display
             */
            const $config = {};
            if (config.label) {
                $config.display = config.label;
            } else {
                $config.display = config.display;
            }
            $config.value = config.value;
            source.config = $config;
        }
    }
    /*
     * 解析 value 处理, 数据源的最终生成已经拿到
     * source
     * {
     *     "data": [],    // 数据源
     *     "display": "", // 显示字段
     *     "value": "",   // 显示值
     * }
     */
    return source;
};

const plxTreeOptions = (reference, config = {}) => {
    /**
     * 1.读取树型结构数据源基本信息
     */
    let options = __DATUM_PARSE.parseOption(reference, config);
    /**
     * 2.规范化处理，读取全树配置（补全）
     */
    let tree = __TREE_TO.toTreeConfig(config.tree);

    const {form} = reference.props;
    if (form) {
        const id = __FORM.formGet(reference, tree.key);
        if (id) {
            /*
             * 1.1 必须过滤当前节点，即主键和当前节点不等
             */
            options = options.filter(option => option[tree.key] !== id);
        }
    }

    /*
     * 构造 Uarr 引用
     */
    const arrRef = Uarr.create(options);
    /*
     * 3.补充属性
     * tree.leaf => 叶节点
     * tree.text => 显示节点
     */
    arrRef.add("isLeaf", (item) => item[tree.leaf])
        .add("title", (item) => item[tree.text]);
    /*
     * 4.选择模式
     * LEAF：只能选择叶节点
     * FULL：可以选择父节点
     */
    if (config.selection) {
        const selection = __Zn.valuePair(config.selection);
        if ("LEAF" === selection.mode) {
            arrRef.add("selectable", (item) => item[selection.field]);
        } else if ("FULL" === selection.mode) {
            arrRef.add("selectable", true)
        }
    }
    /**
     * 5.构造最终树
     */
    return arrRef.tree(tree).to();
};
const plxOptions = (reference, config = {}, filter = () => true) =>
    __DATUM_PARSE.parseOption(reference, config, filter);
const plxDialog = (reference, ...path) => {
    const config = __Zn.fromPath.apply(null, [reference].concat(path));
    if (__Zn.isObject(config)) {
        return config;
    } else if ("string" === typeof config) {
        return {content: config};
    } else {
        return {content: __Zn.fxTerminal(true, 10045, config)};
    }
};
const plxFromTo = (reference, jsx = {}) => {
    const {config = {}} = jsx;
    const normalized = __Zn.clone(config);
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
const plxRecord = (reference, jsx = {}) => {
    let rxRecord = (data) => data;
    if (jsx.record) {
        rxRecord = (data) => {
            if (0 < data.indexOf('{')) {
                const index = data.indexOf('{');
                const prefix = data.substring(0, index);
                const record = data.substring(index);
                return {
                    record: JSON.parse(record),
                    prefix,
                }
            } else {
                return {
                    prefix: data
                }
            }
        }
    }
    return rxRecord;
};
export default {
    plxTreeOptions,
    plxOptions,
    plxDialog,
    plxFromTo,
    plxRecord,
    plxUnique,
};