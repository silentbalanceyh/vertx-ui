import Prop from "../datum";
import U from "underscore";
import E from "../../error";
import Ele from '../../element';
import Abs from '../../abyss';
import Datum from './I.datum';
import Ent from '../../entity';
import Ut from '../../unity';

const {Uarr} = Ent;

const plxTreeOptions = (reference, config = {}) => {
    /**
     * 1.读取树型结构数据源基本信息
     */
    let options = Datum.getSource(reference, config);
    /**
     * 2.规范化处理，读取全树配置（补全）
     */
    let tree = Ut.toTreeConfig(config.tree);
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
        const selection = Ele.valuePair(config.selection);
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
    Datum.getSource(reference, config, filter);
const plxDialog = (reference, ...path) => {
    const config = Prop.fromPath.apply(null, [reference].concat(path));
    if (U.isObject(config)) {
        return config;
    } else if ("string" === typeof config) {
        return {content: config};
    } else {
        return {content: E.fxTerminal(true, 10045, config)};
    }
};
const plxFromTo = (reference, jsx = {}) => {
    const {config = {}} = jsx;
    const normalized = Abs.clone(config);
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
const onLinker = (jsx = {}, fnSupplier) => {
    const {
        reference,
        config,
        options = []
    } = jsx;
    if (reference && config.linker && options) {
        const {linker = {}, linkerField = "key"} = config;
        return (selected) => {
            if (!Abs.isEmpty(linker)) {
                const row = options.filter(option => option[linkerField] === selected);
                if (row[0]) {
                    const formValues = {};
                    Object.keys(linker).forEach(rowField => {
                        const formField = linker[rowField];
                        if (formField && rowField) {
                            formValues[formField] = row[0][rowField];
                        }
                    })
                    Ut.formHits(reference, formValues);
                }
            }
            if (U.isFunction(fnSupplier())) {
                fnSupplier()(selected);
            }
        }
    } else {
        return fnSupplier();
    }
}
const onChange = (rest = {}, fnChange, jsx = {}) => {
    if (U.isFunction(fnChange)) {
        rest.onChange = onLinker(jsx, () => fnChange)
    } else {
        rest.onChange = onLinker(jsx, () => undefined);
    }
};
export default {
    plxTreeOptions,
    plxOptions,
    plxDialog,
    plxFromTo,
    onChange
};