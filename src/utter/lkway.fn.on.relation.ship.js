import Ux from "ux";

const __rGroupData = (identifier, up = [], down = []) => {
    up = Ux.clone(up);
    down = Ux.clone(down);
    const upGroup = Ux.elementGroup(up.filter(item => identifier === item['targetIdentifier']), "sourceIdentifier");
    const downGroup = Ux.elementGroup(down.filter(item => identifier === item['sourceIdentifier']), "targetIdentifier");
    const groupData = {};
    Object.keys(upGroup).forEach(identifier => {
        if (!groupData[identifier]) {
            groupData[identifier] = {};
        }
        groupData[identifier].up = upGroup[identifier];
    });
    Object.keys(downGroup).forEach(identifier => {
        if (!groupData[identifier]) {
            groupData[identifier] = {};
        }
        groupData[identifier].down = downGroup[identifier];
    });
    return groupData;
};
const __rGroupDefine = (identifier, up = [], down = [], idMap = []) => {
    const groupedData = __rGroupData(identifier, up, down);
    const groupedDefine = {};
    idMap.forEach(identifier => groupedDefine[identifier] = {up: [], down: []});
    Object.assign(groupedDefine, groupedData);
    return groupedDefine;
};

const __rFromDefine = (reference, identifier, field = "upstream") => {
    const {$definition = []} = reference.props;
    return $definition.filter(item => item[field] === identifier);
};

const __rParent = (identifier, category = []) => {
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

const __rFromDefinition = (reference, identifier, category = []) => {
    /*
     * 1. 判断 $definition 中是否包含了 fromId
     * upstream = fromId
     */
    const found = __rFromDefine(reference, identifier);
    if (0 < found.length) {
        /*
         * 找到上级
         */
        return found;
    } else {
        /*
         * 未找到上级，动用父类
         */
        const parentId = __rParent(identifier, category);
        if (parentId) {
            return __rFromDefinition(reference, parentId, category);
        }
    }
};

const __rToUnique = (fromRet, identifier, categories = []) => {
    const filtered = fromRet.filter(item => identifier === item['downstream']);
    if (0 < filtered.length) {
        const relation = filtered[0];
        if (relation) {
            return relation.type;
        }
    } else {
        const parentId = __rParent(identifier, categories);
        if (parentId) {
            return __rToUnique(fromRet, parentId, categories);
        }
    }
};
const onRelation = (current = {}, config = {}, $defineMap) => {
    const {up = [], down = []} = config;
    if ($defineMap) {
        /*
         * 定义分组
         */
        return __rGroupDefine(current.identifier, up, down, $defineMap);
    } else {
        /*
         * 数据分组
         */
        return __rGroupData(current.identifier, up, down);
    }
};
const onRelationIdentifiers = (identifier, source = [], definition = []) => {
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
    const ids = source.filter(item => keys.includes(item.key)).map(item => item.identifier);
    /*
     * 计算 upIds / downIds
     */
    const upIds = definition.filter(item => ids.includes(item['downstream'])).map(item => item["upstream"]);
    const downIds = definition.filter(item => ids.includes(item['upstream'])).map(item => item["downstream"]);
    /*
     * 读取 upKeys / downKeys
     */
    const upKeys = source.filter(item => upIds.includes(item.identifier)).map(item => item.key);
    const downKeys = source.filter(item => downIds.includes(item.identifier)).map(item => item.key);
    /*
     * 读取当前所有keys以及它的子类
     */
    const upAllKeys = Ux.treeChildrenAllIn(upKeys, source, "parentId");
    const downAllKeys = Ux.treeChildrenAllIn(downKeys, source, "parentId");
    /*
     * 最终计算出来的 identifier
     */
    const identifiers = {up: [], down: []};
    source.filter(item => upAllKeys.includes(item.key))
        .filter(item => item.leaf).map(item => item.identifier)
        .forEach(identifier => identifiers.up.push(identifier));
    source.filter(item => downAllKeys.includes(item.key))
        .filter(item => item.leaf).map(item => item.identifier)
        .forEach(identifier => identifiers.down.push(identifier));
    return identifiers;
};

const onRelationType = (reference, record = {}) => {
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
                const fromRet = __rFromDefinition(reference, fromId, categories);
                if (fromRet && 0 < fromRet.length) {
                    return __rToUnique(fromRet, toId, categories);
                }
            }
        }
    }
}
export default {
    onRelationType,
    onRelation,
    onRelationIdentifiers
}