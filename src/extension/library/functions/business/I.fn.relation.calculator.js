/*
 * 根据当前的 identifier 计算整个类树路径上的所有的 identifier
 */
import Ux from "ux";

/**
 *
 * ## 扩展函数
 *
 * 计算关系的 identifier 专用函数，返回的数据结构如：
 *
 * ```json
 * {
 *     "up": [],
 *     "down": []
 * }
 * ```
 *
 * * up: 上游关系数据。
 * * down: 下游关系数据。
 *
 * @memberOf module:_on
 * @method onRelationIdentifiers
 * @param {String} identifier 统一标识符
 * @param {Array} source 关系数据源
 * @param {Array} definition 关系定义数据源
 * @returns {Object} 返回关系数据对象
 */
export default (identifier, source = [], definition = []) => {
    /*
     * 读取传入的 identifier 的 category key
     */
    const category = source.filter(item => identifier === item.identifier);
    /*
     * 读取 category 对应的所有类、父类、根类信息
     */
    const keys = Ux.treeParentAllIn(category.map(item => item.key), source, "parentId");
    /*
     * [key1, key2, key3] 再次读取所有的 category 对应的 identifier 集合
     */
    const $keys = Ux.immutable(keys);
    const ids = source.filter(item => $keys.contains(item.key)).map(item => item.identifier);
    /*
     * 计算 upIds / downIds
     */
    const $ids = Ux.immutable(ids);
    const upIds = definition.filter(item => $ids.contains(item['downstream'])).map(item => item["upstream"]);
    const downIds = definition.filter(item => $ids.contains(item['upstream'])).map(item => item["downstream"]);
    /*
     * 读取 upKeys / downKeys
     */
    const $upIds = Ux.immutable(upIds);
    const $downIds = Ux.immutable(downIds);
    const upKeys = source.filter(item => $upIds.contains(item.identifier)).map(item => item.key);
    const downKeys = source.filter(item => $downIds.contains(item.identifier)).map(item => item.key);
    /*
     * 读取当前所有keys以及它的子类
     */
    const upAllKeys = Ux.treeChildrenAllIn(upKeys, source, "parentId");
    const downAllKeys = Ux.treeChildrenAllIn(downKeys, source, "parentId");

    const $upAllKeys = Ux.immutable(upAllKeys);
    const $downAllKeys = Ux.immutable(downAllKeys);
    /*
     * 最终计算出来的 identifier
     */
    const identifiers = {up: [], down: []};
    source.filter(item => $upAllKeys.contains(item.key))
        .filter(item => item.leaf).map(item => item.identifier)
        .forEach(identifier => identifiers.up.push(identifier));
    source.filter(item => $downAllKeys.contains(item.key))
        .filter(item => item.leaf).map(item => item.identifier)
        .forEach(identifier => identifiers.down.push(identifier));
    return identifiers;
};