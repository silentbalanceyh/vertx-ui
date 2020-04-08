/*
 * data （配置项记录）
 * 构造 ExRelation 专用
 */
import U from "underscore";
import Ux from 'ux';

const onKey = (array = []) => array.forEach(each => {
    if (!each.key) {
        each.key = Ux.randomUUID();
    }
});
/**
 * ## 扩展函数
 *
 * 关系扩展配置，data 中的数据结构：
 *
 * ```json
 * {
 *     "up": [],
 *     "down": []
 * }
 * ```
 *
 * @memberOf module:_config
 * @param {Object} data 基本数据信息
 * @param {Object} config 关系完整配置
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 最终的关系配置数据信息
 */
const configRelation = (data = {}, config = {}, reference) => {
    const attrs = {};
    const $data = {};
    if (U.isArray(data.down)) {
        $data.down = data.down;
    } else {
        $data.down = [];
    }
    if (U.isArray(data.up)) {
        $data.up = data.up;
    } else {
        $data.up = [];
    }
    {
        /*
         * 注入 key 的 uuid 值
         */
        onKey($data.up);
        onKey($data.down);
    }
    attrs.data = $data;
    /*
     * 设置 current 变量
     */
    const current = {};
    current.name = data.name;
    current.code = data.code;
    current.key = data.key;
    current['globalId'] = data['globalId'];
    /*
     * 计算 category 和 identifier
     */
    const {category = {}} = config;
    const {field, source = "data.category"} = category;
    /*
     * hitField
     */
    let hitField;
    const findValue = (fields = []) => {
        let found;
        for (let idx = 0; idx < fields.length; idx++) {
            if (data[fields[idx]]) {
                found = fields[idx];
                break;
            }
        }
        return found;
    };
    if ("string" === typeof field) {
        if (0 <= field.indexOf(',')) {
            const fields = field.split(',');
            hitField = findValue(fields);
        } else {
            hitField = field;
        }
    } else {
        if (Ux.isArray(field)) {
            hitField = findValue(field);
        }
    }
    let $path = {};
    if (data[hitField]) {
        const categoryArray = Ux.onDatum(reference, source);
        const category = Ux.elementUnique(categoryArray, "key", data[hitField]);
        if (category) {
            /*
             * X_CATEGORY 中包含了固定的结构
             */
            current.identifier = category.identifier;
            current.category = category.name;
            current.categoryKey = category.key;
            attrs.current = current;
            /*
             * 只有 category 出现的时候才执行 $path
             * 1）如果 definition 有值，则从 definition 中读取
             * 2）如果 definition = false，则从数据中读取
             */
            $path = Ux.treeFlip(categoryArray, {parent: "parentId", keyField: "identifier"});
        }
    }
    attrs.$path = $path;
    return attrs;
};
export default {
    configRelation
}