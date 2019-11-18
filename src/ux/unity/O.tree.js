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

const toTreeArray = (data = [], config = {}) => {
    config = toTreeConfig(config);
    const normalized = [];
    data.filter(item => !!item.key).forEach(each => {
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
            // TreeData 专用属性
            "title",
            "isLeaf",
            "selectable",
        ].filter(field => each.hasOwnProperty(field))
            .forEach(field => processed[field] = each[field]);
        // 必须包含主键（不包含主键的行不需要）
        normalized.push(processed);
    });
    return normalized;
};
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
        .filter(item => !item.parent)   // 过滤（只查找主节点）
        .sort((left, right) => left.sort - right.sort); // 排序
    root.forEach(item => {
        /*
         * 针对每一个 root 节点查找子节点
         * 不拷贝，直接追加 children 方法
         */
        item.children = Ele.elementChild(normalized, item);
    });
    return root;
};
export default {
    toTree,
    toTreeConfig,
    toTreeArray
}