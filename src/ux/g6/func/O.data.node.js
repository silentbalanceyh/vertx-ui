import Abs from '../../abyss';
import Ele from '../../element';
import Eng from '../../engine';
import U from '../../unity';


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
 * 构造树形分类信息，提取关系数据
 */
const g6DataTree = (reference, config = {}) => {
    const {model = "resource.models", category = "graphic.nodes"} = config;
    const models = Eng.onDatum(reference, model);
    let categoryList = Eng.onDatum(reference, category);
    /*
     * 模型列表处理
     */
    const $identifiers = Abs.immutable(models
        .filter(item => !!item.metadata)
        .filter(item => item.metadata.relation)
        .map(item => item.identifier));
    /*
     * 先转换数据源
     */
    categoryList = categoryList.map(g6Image('icon'));
    /*
     * category 中过滤，并且追加排序因子
     */
    const treeArray = U.toTreeArray(categoryList, {text: "name", title: "name"});
    const $source = Abs.clone(treeArray);
    treeArray.forEach(each => {
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
    /*
     * 排序过滤运算
     */
    return treeArray
        .sort((left, right) => left.sequence - right.sequence)
        .filter(each => $identifiers.contains(each.data.identifier));
};
const g6Image = (fieldImage = 'image') => {
    return (item = {}) => {
        // 在 item 对象中追加 fieldImage 指定的字段信息
        let image;
        const {metadata} = item;
        if (metadata && metadata.image) {
            // 1. 优先考虑 metadata 配置中的 image 字段
            image = metadata.image;
        } else {
            // 2..最简单直接的配置处理
            image = '/img/ox/ci/' + item.identifier + ".png";
        }
        item[fieldImage] = image;
        return item;
    }
}

const x6FromTo = (edge, field) => {
    const source = edge.getSourceNode().getData();
    const target = edge.getTargetNode().getData();
    if (source && target) {
        if (field) {
            // 有字段名，则提取字段名处理
            return [source[field], target[field]];
        } else {
            // 无字段名，直接提取节点信息
            return [source, target];
        }
    } else {
        // 返回两个 undefined
        return [undefined, undefined];
    }
}
export default {
    // 数据部分
    g6DataTree,

    // 读取 source 和 target
    x6FromTo,

    // 节点执行
    g6Image,
}