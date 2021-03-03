/*
 * 将数组转换成树的标准方法
 * 1）树形菜单
 * 2）TreeSelect中的选项
 * 3）可配置
 * 4）数据源可以是 datum 中的配置
 * 树的配置基于 X_CATEGORY 表的结构执行，默认值：
 * {
 *     key: "key",
 *     parent: "parentId",
 *     value: "key",
 *     text: "text",
 *     title: "text",
 *     sort: "sort",
 *     level: "level"
 * }
 */
import Abs from "../abyss";
import Ele from '../element';
import St from './O.sorter';
import Encrypt from './O.encrypt';
import T from './O.plugin.element';

/**
 * ## 「标准」`Ux.toTreeConfig`
 *
 * 针对树形配置执行规范化处理，处理过后的数据结构如：
 *
 * ```json
 * {
 *     key: "树上的每个节点的主键字段",
 *     parent: "树上构造整个树的节点时的父节点字段",
 *     value: "树节点每个节点的值",
 *     text: "树节点每个节点显示文字",
 *     title: "树节点每个节点标题",
 *     sort: "树节点的排序字段",
 *     leaf: "当前树节点是否叶节点的检查字段",
 *     level: "当前节点的level字段，也可以直接计算"
 * }
 * ```
 *
 * @memberOf module:_to
 * @param {Object} config 传入的原始树配置。
 * @returns {Object} 返回合法的树配置对象。
 */
const toTreeConfig = (config = {}) => {
    if ("string" === typeof config) {
        const parsed = Ele.valuePair(config);
        return toTreeConfig(parsed);
    } else {
        /*
         * config的配置处理
         */
        const $config = Abs.clone(config);
        /*
         * 1. 树的主键 和 分支键
         * 标准化：key / parent
         * */
        if (!config.key) $config.key = "key";
        if (!config.parent) $config.parent = "parentId";
        /*
         * 2. 树的节点基本值信息
         * 标准化：value / label
         */
        if (!config.value) $config.value = $config.key;
        if (!config.text) $config.text = "text";
        if (!config.title) $config.title = "title";
        /*
         * 3. 是否支持表达式
         * 标准化：expr，默认 无
         */
        // config.expr 是固定值
        /*
         * 4. 排序字段
         * 标准化：sort
         */
        if (!config.sort) $config.sort = "sort";
        /*
         * 5. 叶节点字段 / 层级字段
         */
        if (!config.leaf) $config.leaf = "leaf";
        if (!config.level) $config.level = "level";
        Object.freeze($config);
        return $config;
    }
};


/**
 * ## 「标准」`Ux.toTreeArray`
 *
 * 构造树形数组，每个元素都是一个平行节点，核心结构：
 *
 * ```json
 * {
 *     "data": {
 *         "...": "原始数据"
 *     },
 *     key: "树上的每个节点的主键字段",
 *     parent: "树上构造整个树的节点时的父节点字段",
 *     value: "树节点每个节点的值",
 *     text: "树节点每个节点显示文字",
 *     title: "树节点每个节点标题",
 *     sort: "树节点的排序字段",
 *     leaf: "当前树节点是否叶节点的检查字段",
 *     level: "当前节点的level字段，也可以直接计算",
 *
 *     disabled: "是否禁用，提取属性",
 *     isLeaf: "提取叶节点属性",
 *     selectable: "是否可选中，提取属性",
 *     className: "风格Css 对应的类名",
 *     title: "标题",
 *     icon: "图标"
 * }
 * ```
 *
 * 最终数据结构两层，用于很多地方的树处理，在构造树的过程中每个节点都会包含这些基础属性，而原始记录存在于`data`节点。
 *
 * @memberOf module:_to
 * @param {Array} data 输入数组数据。
 * @param {Object} config 传入的树配置。
 * @return {Array} 返回最终的树形数组。
 */
const toTreeArray = (data = [], config = {}) => {
    config = toTreeConfig(config);
    const normalized = [];
    data.filter(item => !!item[config.key]).forEach(each => {
        const processed = {};
        processed.data = Abs.clone(each);   // 数据节点
        Abs.itObject(config, (to, from) => {
            if (undefined !== each[from]) {
                processed[to] = each[from]; // 只取合法值
            }
        });
        /* 保留特殊值，用于UI渲染 */
        [
            "disabled",
            "className",
            "icon",
            "image",            // icon 是旧版本，image 是新版本，二者都保留
            // TreeData 专用属性
            "title",
            "isLeaf",
            "selectable",
            "checkable",
            "disableCheckbox",
        ].filter(field => each.hasOwnProperty(field))
            .forEach(field => processed[field] = each[field]);
        // 必须包含主键（不包含主键的行不需要）
        if (config['pinyin']) {
            processed[config.sort] = Ele.valuePinyin(processed.title);
        }
        normalized.push(processed);
    });
    return normalized;
};


/**
 * ## 「标准」`Ux.toTree`
 *
 * 整个树的每一个节点会包含 `children` 的叶节点信息，一个节点可能包含多个叶节点，顶层数组只包括顶层父类数组。
 *
 * @memberOf module:_to
 * @param {Array} data 输入数组数据。
 * @param {Object} config 传入的树配置。
 * @return {Array} 返回标准树桩结构。
 */
const toTree = (data = [], config = {}) => {
    // --------------- 上述配置一旦成型过后不再变更
    const $config = toTreeConfig(config);
    /*
     * 第一次变化
     * 1）一级数组转换成带数据节点的数组
     * 2）数据节点为：'data' 节点，包含了原始值，剩余节点保留
     * TreeSelect / TreeMenu 专用
     */
    const normalized = toTreeArray(data, $config);

    /*
     * 第二次变化，展开成树
     * 1）子节点名称为 children
     * 2）主键为 key
     * 3）父节点ID为 parent
     */
    const root = normalized
        .filter(item => !item.parent)           // 过滤// （只查找主节点）
        .sort(St.sorterAscTFn($config.sort));    // 排序
    root.forEach(item => {
        /*
         * 针对每一个 root 节点查找子节点
         * 不拷贝，直接追加 children 方法
         */
        item.children = T.elementChildTree(normalized, item);
    });
    return root;
};
const toTreeTextArray = (textArr = []) => {
    const textArray = [];
    textArr.forEach(literal => {
        const joinSet = _toTreeText(literal.split('/'));
        Array.from(joinSet).forEach(each => {
            const existing = textArray.filter(item => item.key === each.key).length;
            if (0 === existing) {
                textArray.push(each);
            }
        })
    });
    return textArray.sort(St.sorterAscFn("dataKey"));
}
const _toTreeText = (sourceArr = []) => {
    const keySet = new Set();
    const item = {};
    const dataKey = sourceArr.join('/');
    item.key = Encrypt.encryptMD5(dataKey);
    item.dataKey = dataKey;
    item.name = sourceArr[sourceArr.length - 1];
    if (0 <= (sourceArr.length - 1)) {
        /*
         * 子数组
         */
        const sliced = sourceArr.slice(0, sourceArr.length - 1);
        if (0 < sliced.length) {
            item.parentId = Encrypt.encryptMD5(sliced.join('/'));
            /*
             * 子项
             */
            const childSet = _toTreeText(sliced);
            Array.from(childSet).forEach(child => keySet.add(child));
        }
        keySet.add(item);
    }
    return keySet;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    toTree,
    toTreeConfig,
    toTreeArray,
    toTreeTextArray,
}