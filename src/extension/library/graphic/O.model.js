import Ux from 'ux';
import fnImage from './O.fn.image';

const _sortTree = (categoryData) => {
    const $source = Ux.clone(categoryData);
    categoryData.forEach(each => {
        const branch = Ux.elementBranch($source, each.key).map(item => item.sort);
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
        each.sequence = Ux.valueInt(level);
    });
    return categoryData.sort((left, right) => left.sequence - right.sequence);
};
/*
 * 模型 / 分类计算
 * 1）模型中 metadata.relation = true
 * 2）分类中如果没有 metadata.image 就直接使用 identifier 计算，如果有，则直接 metadata.image
 */
const g6Models = (models = [], category = []) => {
    /*
     * 模型列表处理
     */
    const $identifiers = Ux.immutable(models
        .filter(item => !!item.metadata)
        .filter(item => item.metadata.relation)
        .map(item => item.identifier));
    /*
     * category 中过滤
     */
    const treeArray = Ux.toTreeArray(category, {text: "name", title: "name"});
    return _sortTree(treeArray)
        .filter(each => $identifiers.contains(each.data.identifier))
        .map(each => {
            each.image = fnImage(each.data);
            return each;
        });
};
export default {
    g6Models,
}