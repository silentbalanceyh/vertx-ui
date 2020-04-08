import O from './O.node.js';
import Abs from '../../../abyss';
import Ele from '../../../element';
import Eng from '../../../engine';
import U from '../../../unity';

const _sortTree = (categoryData) => {
    const $source = Abs.clone(categoryData);
    categoryData.forEach(each => {
        const branch = Ele.elementBranch($source, each.key).map(item => item.sort);
        /*
         * 重算 sort 因子
         * length = 3 （叶子节点）
         * length = 2 （中间节点）
         * length = 1 （根节点）
         */
        each.level = branch.length;
        if (2 === branch.length) {
            branch.push(0);
        }
        if (1 === branch.length) {
            branch.push(0);
            branch.push(0);
        }
        let level = "";
        branch.forEach(each => {
            if (each < 10) {
                level += `0${each}`
            } else {
                level += `${each}`
            }
        });
        each.sequence = Ele.valueInt(level);
    });
    return categoryData.sort((left, right) => left.sequence - right.sequence);
};

/*
 * 模型 / 分类计算
 * 1）模型中 metadata.relation = true
 * 2）分类中如果没有 metadata.image 就直接使用 identifier 计算，如果有，则直接 metadata.image
 * 3）处理 Data Model 相关信息，元素为 treeArray 的结果
 * 每个元素的数据结构
 * {
 *      "text": "显示文本",
 *      "title": "显示文本",
 *      "key": "主键",
 *      "parent": "父键",
 *      "value": "值节点",
 *      "sort": "排序字段",
 *      "leaf": "是否叶节点",
 *      "level": "当前节点所在层级",
 *      "sequence": "顺序（计算出来的，可按该字段排序）",
 *      "icon": "图标路径，最终可以被 fnImage 解析",
 *      "data": {
 *           "...field": "所有字段信息"
 *      }
 * }
 */
const g6DataTree = (reference) => {
    const models = Eng.onDatum(reference, "resource.models");
    const category = Eng.onDatum(reference, "graphic.nodes");
    /*
     * 模型列表处理
     */
    const $identifiers = Abs.immutable(models
        .filter(item => !!item.metadata)
        .filter(item => item.metadata.relation)
        .map(item => item.identifier));
    /*
     * category 中过滤
     */
    const treeArray = U.toTreeArray(category, {text: "name", title: "name"});
    return _sortTree(treeArray)
        .filter(each => $identifiers.contains(each.data.identifier))
        .map(each => {
            each.icon = O.g6UiImage(each.data);
            return each;
        });
};
export default {
    g6DataTree,
}