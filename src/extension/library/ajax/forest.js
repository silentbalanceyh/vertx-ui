import datum from './datum';
import Ux from 'ux';

const isExpr = (expr) => expr && "string" === typeof expr
    && (0 < expr.indexOf(',') || 0 < expr.indexOf('='))
/*
 * 条件 identifier
 *
 * tree -> 分组
 * code = xxx（条件）
 *
 * 最终返回数据结构
 * {
 *      "group1": [],
 *      "group2": []
 * }
 */
const calcGroup = (categories = [], inputGroup = {}) => {
    /*
     * 先提取所有组的参数
     */
    const groupName = new Set();
    /*
     * 提取不抓取的所有数据
     */
    const $types = Ux.immutable(categories.map(category => category.type));

    categories.forEach(category => {
        // 判断 identifier 的值
        if (isExpr(category.identifier)) {
            // 转换参数组
            const parsed = Ux.Ant.toParsed(category.identifier);
            if (parsed && !$types.contains(parsed.tree)) {
                groupName.add(parsed.tree);             // type 参数
                category.__connect = Ux.clone(parsed);
            }
        }
    })
    /*
     * 根据参数组执行分组
     */
    const types = Array.from(groupName);
    if (0 < types.length) {
        return datum.category(types).then(next => {
            /*
             * 计算 inputGroup 部分
             */
            const groupMap = Ux.elementGroup(next, 'type');
            if (groupMap) {
                Object.assign(inputGroup, groupMap);
            }
            return calcGroup(next, inputGroup).then(() => Ux.promise(inputGroup));
        })
    } else return Ux.promise(inputGroup);
}
const calcAddon = (item = {}) => {
    const {metadata = {}, ...rest} = item;
    const {selectable = true, checkable = true} = metadata;
    return {...rest, checkable, selectable};
}
const calcTree = (categories = [], group = {}, mode) => {
    const normalized = [];
    categories.forEach(category => {
        const {__connect, ...rest} = category;
        if (__connect && group[__connect.tree]) {
            let groupData = group[__connect.tree];
            if (Ux.isArray(groupData)) {
                // 读取连接子节点
                let filtered = groupData.filter(item => {
                    if (__connect.code) {
                        return __connect.code === item.code;
                    } else return true;
                });
                // 拷贝即将添加的数据
                const $filtered = Ux.clone(filtered);
                if ("REPLACE" === mode) {
                    // 不追加当前节点
                    if (category.parentId) {
                        $filtered.forEach(node => node.parentId = category.parentId);
                    }
                } else {
                    // 添加当前节点
                    normalized.push(calcAddon(rest));
                    // 不替换当前节点，直接作为当前节点的子节点
                    $filtered.forEach(node => node.parentId = category.key);
                }
                // 添加每一个节点
                const tree = calcTree($filtered, group, mode);
                if (Ux.isArray(tree) && 0 < tree.length) {
                    tree.forEach(node => {
                        // 连接节点信息
                        normalized.push(calcAddon(node));
                        // 连接子树节点
                        const children = Ux.elementChildren(groupData, node, "parentId");
                        if (Ux.isArray(children) && 0 < children.length) {
                            children.forEach(child => normalized.push(calcAddon(child)));
                        }
                    });
                }
            }
        } else {
            /*
             * 不连接的正常数据
             */
            normalized.push(Ux.clone(rest));
        }
    });
    return normalized;
}
export default (type, mode) => {
    if (type) {
        return datum.category({type}).then(categories => {
            /*
             * 特殊数据结构
             */
            return calcGroup(categories, {}).then(grouped => {
                /*
                 * 根据最终的 grouped 计算 最终的 normalized
                 */
                return calcTree(categories, grouped, mode);
            });
        })
    } else return Ux.promise([])
}