/*
 * data （配置项记录）
 * 构造 ExRelation 专用
 */
import U from "underscore";
import Ux from 'ux';

const configRelation = (data = {}, config = {}, reference) => {
    const attrs = {};
    const $data = {};
    if (U.isArray(data['downstreams'])) {
        $data.down = data['downstreams'];
    } else {
        $data.down = [];
    }
    if (U.isArray(data['upstreams'])) {
        $data.up = data['upstreams'];
    } else {
        $data.up = [];
    }
    attrs.data = $data;
    /*
     * 设置 current 变量
     */
    const current = {};
    current.name = data.name;
    current.code = data.code;
    /*
     * 计算 category 和 identifier
     */
    const {category = {}} = config;
    const {field, source = "data.category"} = category;
    let $path = {};
    if (data[field]) {
        const categoryArray = Ux.onDatum(reference, source);
        const category = Ux.elementUnique(categoryArray, "key", data[field]);
        if (category) {
            /*
             * X_CATEGORY 中包含了固定的结构
             */
            current.identifier = category.identifier;
            current.category = category.name;
            attrs.current = current;
            /*
             * 只有 category 出现的时候才执行 $path
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