import Ut from '../unity';
import Eng from '../engine';

/**
 * ## 特殊函数「Zero」
 *
 * 前端标识规则选择器
 *
 * 根据配置执行标识规则选择，配置数据格式如：
 *
 * ```json
 * {
 *     "dataKey": "<抓取含有标识规则的字典>",
 *     "parentField": "<标识规则的父字段字段名>"
 * }
 * ```
 *
 * 选择规则：
 *
 * 1. 第一选择：直接选择`props`中的 `$identifier` 属性值作为第一选择标识规则。
 * 2. 第二选择：从 `dataKey` 中读取 Assist 数据，然后执行 treeShared 来执行选择。
 *
 * > 当前选择是选择 $options 相关的树中查找到的节点的 identifier 数据。
 *
 * @memberOf module:_romantic
 * @method sexIdentifier
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} config 标识规则选择配置。
 * @return {any} 返回的 identifier。
 */
export default (reference, config = {}) => {
    const {
        dataKey = "data.category",
        parentField = "parentId"
    } = config;
    let identifier = null;
    const {$options = {}, $identifier} = reference.props;
    if ($identifier) {
        identifier = $identifier;
    } else {
        const {tree = []} = $options;
        if (0 < tree.length) {
            const treeArray = Eng.onDatum(reference, dataKey);
            identifier = Ut.treeShared(tree, treeArray, {
                parent: parentField,
                target: "identifier"
            });
        }
    }
    return identifier;
};