import Ux from 'ux';
import __Shd from './levy.__.fn.i.failover.common';
// =====================================================
// 森林算法
// =====================================================
const __calcAddon = (item = {}) => {
    const {metadata = {}, ...rest} = item;
    const {selectable = true, checkable = true} = metadata;
    const result = {...rest, checkable, selectable};
    if (!selectable) {
        result.className = "ux-unselect"
    }
    return result;
}
const __calcTree = (categories = [], group = {}, mode) => {
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
                    normalized.push(__calcAddon(rest));
                    // 不替换当前节点，直接作为当前节点的子节点
                    $filtered.forEach(node => node.parentId = category.key);
                }
                // 添加每一个节点
                const tree = __calcTree($filtered, group, mode);
                if (Ux.isArray(tree) && 0 < tree.length) {
                    tree.forEach(node => {
                        // 连接节点信息
                        normalized.push(__calcAddon(node));
                        // 连接子树节点
                        const children = Ux.elementChildren(groupData, node, "parentId");
                        if (Ux.isArray(children) && 0 < children.length) {
                            children.forEach(child => normalized.push(__calcAddon(child)));
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

const withForest = (type, mode = "REPLACE") => {
    if (type) {
        return __Shd.iCategory({type}).then(categories => {
            /* 特殊数据结构 */
            return Ux.forestGroup(categories, {}, __Shd.iCategory).then(grouped => {
                /* 根据最终的 grouped 计算 最终的 normalized */
                return Ux.promise(__calcTree(categories, grouped, mode));
            });
        })
    } else return Ux.promise([]);
}

export default {
    withForest,
}