import __Zn from './zero.module.dependency';
import __V_KEEP from './tree.__.v.attribute.node';

const toTreeConfig = (config = {}) => {
    if ("string" === typeof config) {
        const parsed = __Zn.valuePair(config);
        return toTreeConfig(parsed);
    } else {
        /*
         * config的配置处理
         */
        const $config = __Zn.clone(config);
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

        // root 处理
        if (config.root) {
            $config.root = __Zn.valueInt(config.root, 1);
        } else {
            $config.root = 1;
        }
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
    data.filter(item => !!item[config.key]).forEach(each => {
        const processed = {};
        processed.data = __Zn.clone(each);   // 数据节点
        __Zn.itObject(config, (to, from) => {
            if (undefined !== each[from]) {
                processed[to] = each[from]; // 只取合法值
            } else {
                // If expr
                if ("string" === typeof from
                    && 0 <= from.indexOf(":")) {
                    processed[to] = __Zn.formatExpr(from, each, true);
                }
            }
        });
        if (processed.text && !processed.title) {
            processed.title = processed.text;
        }
        /* 保留特殊值，用于UI渲染 */
        let fields = [];
        if ("string" === typeof config.sort) {
            fields = [config.sort].concat(__V_KEEP);
        } else if (__Zn.isArray(config.sort)) {
            fields = config.sort.concat(__V_KEEP);
        } else {
            fields = __V_KEEP;
        }
        fields.filter(field => each.hasOwnProperty(field))
            .forEach(field => processed[field] = each[field]);
        // 必须包含主键（不包含主键的行不需要）
        if (config['pinyin']) {
            processed[config.sort] = __Zn.valuePinyin(processed.title);
        }
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
        .filter(item => !item.parent)           // 过滤// （只查找主节点）
        .sort((left, right) => {
            if (__Zn.isFunction($config.sort)) {
                // when the sort is function
                return $config.sort(left, right)
            } else {
                // when the sort is string ( 直接排序 ）
                return __Zn.sorterAscT(left[$config.sort], right[$config.sort]);
            }
        });    // 排序
    root.forEach(item => {
        /*
         * 针对每一个 root 节点查找子节点
         * 不拷贝，直接追加 children 方法
         */
        item.children = __Zn.elementChildTree(normalized, item);
    });

    /*
     * 配置中的 root 设置
     * root = 1, 默认值为1，和 _level 比对
     */
    let treeResult = [];
    if (1 < $config.root) {
        __Zn.itTree(root, (item) => {
            if ($config.root === item._level) {
                treeResult.push(item);
            }
        });
    } else {
        treeResult = __Zn.clone(root);
    }
    return treeResult;
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
    return textArray.sort(__Zn.sorterAscFn("dataKey"));
}
const _toTreeText = (sourceArr = []) => {
    const keySet = new Set();
    const item = {};
    const dataKey = sourceArr.join('/');
    item.key = __Zn.encryptMD5(dataKey);
    item.dataKey = dataKey;
    item.name = sourceArr[sourceArr.length - 1];
    if (0 <= (sourceArr.length - 1)) {
        /*
         * 子数组
         */
        const sliced = sourceArr.slice(0, sourceArr.length - 1);
        if (0 < sliced.length) {
            item.parentId = __Zn.encryptMD5(sliced.join('/'));
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
export default {
    toTreeConfig,
    toTreeArray,
    toTree,
    toTreeTextArray,
}