import onRelationIdentifiers from './I.fn.relation.calculator';
import onRelationType from './I.fn.type.calculator';
import DT from './I.relation.data';
import DD from './I.relation.define';

/**
 * ## 扩展函数
 *
 * 计算关系专用函数。
 *
 * @memberOf module:_on
 * @param {Object} current 当前节点的关系处理
 * @param {Object} config 上下游专用配置处理
 * @param {Object} $defineMap 定义的关系关联数据
 * @returns {Object} 分组过后的关系信息
 */
const onRelation = (current = {}, config = {}, $defineMap) => {
    const {up = [], down = []} = config;
    if ($defineMap) {
        /*
         * 定义分组
         */
        return DD.dataGroup(current.identifier, up, down, $defineMap);
    } else {
        /*
         * 数据分组
         */
        return DT.dataGroup(current.identifier, up, down);
    }
};
export default {
    onRelation,
    onRelationIdentifiers,
    onRelationType,
}