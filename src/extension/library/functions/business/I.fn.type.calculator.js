import Ux from 'ux';

const findFDefine = (reference, identifier, field = "upstream") => {
    const {$definition = []} = reference.props;
    return $definition.filter(item => item[field] === identifier);
};

const findParent = (identifier, category = []) => {
    let current = category.filter(item => identifier === item.identifier);
    if (0 < current.length) {
        /*
         * 丢弃后边的，只保留一个
         */
        current = current[0];
        if (current) {
            const parent = Ux.elementUnique(category, "key", current.parentId);
            if (parent) {
                return parent.identifier;
            }
        }
    }
};

const findFDefinition = (reference, identifier, category = []) => {
    /*
     * 1. 判断 $definition 中是否包含了 fromId
     * upstream = fromId
     */
    const found = findFDefine(reference, identifier);
    if (0 < found.length) {
        /*
         * 找到上级
         */
        return found;
    } else {
        /*
         * 未找到上级，动用父类
         */
        const parentId = findParent(identifier, category);
        if (parentId) {
            return findFDefinition(reference, parentId, category);
        }
    }
};

const findTUnique = (fromRet, identifier, categories = []) => {
    const filtered = fromRet.filter(item => identifier === item['downstream']);
    if (0 < filtered.length) {
        const relation = filtered[0];
        if (relation) {
            return relation.type;
        }
    } else {
        const parentId = findParent(identifier, categories);
        if (parentId) {
            return findTUnique(fromRet, parentId, categories);
        }
    }
};
/**
 *
 * ## 扩展函数
 *
 * 计算关系类型专用函数，计算唯一关系信息。
 *
 * @memberOf module:_on
 * @method onRelationType
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} record 当前数据记录
 * @returns {undefined|Object} 返回唯一关系值
 */
export default (reference, record = {}) => {
    /*
     * 定义
     */
    const fromId = record.sourceIdentifier;
    const toId = record.targetIdentifier;
    /*
     * category 读取
     */
    const {config = {}} = reference.props;
    if (config.relation) {
        const {source} = config.relation;
        if (source) {
            const categories = Ux.onDatum(reference, source);
            if (0 < categories.length) {
                /*
                 * 使用 fromId 查找
                 */
                const fromRet = findFDefinition(reference, fromId, categories);
                if (fromRet && 0 < fromRet.length) {
                    return findTUnique(fromRet, toId, categories);
                }
            }
        }
    }
}