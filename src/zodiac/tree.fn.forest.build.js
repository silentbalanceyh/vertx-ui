import __Zn from './zero.module.dependency';
import __TREE from './tree.fn.to.configuration';
import __PR from './source.datum.fn.parse.data';

const forestGroup = (input = [], group = {}, supplier) => {
    /*
     * 先提取所有组的参数
     */
    const groupName = new Set();
    const $types = input.map(item => item.type);
    // 表达式函数
    const isExpr = (expr) => expr && "string" === typeof expr
        && (0 < expr.indexOf(',') || 0 < expr.indexOf('='));
    input.filter(item => isExpr(item.identifier)).forEach(item => {
        const parsed = __PR.parseSource(item.identifier);
        if (parsed && !$types.includes(parsed.tree)) {
            groupName.add(parsed.tree);         // type 参数
            item.__connect = __Zn.clone(parsed);
        }
    });
    const types = Array.from(groupName);
    if (0 < types.length) {
        if (__Zn.isFunction(supplier)) {
            /*
             * 根据 types 转换新的 Array 出来执行分组操作
             */
            return supplier(types).then(next => {
                const groupMap = __Zn.elementGroup(next, 'type');
                if (groupMap) {
                    Object.assign(group, groupMap);
                }
                return forestGroup(next, group)
                    // 递归处理
                    .then(() => __Zn.promise(group));
            })
        } else return __Zn.promise(group);
    } else return __Zn.promise(group);
}

const forestSync = (inputData = [], config = {}, group = {}) => {
    const normalized = [];
    const {treeConfig = {}} = config;
    const calcAddon = (item = {}) => {
        const {metadata = {}, ...rest} = item;
        const {selectable = true, checkable = true} = metadata;
        const result = {...rest, checkable, selectable};
        if (!selectable) {
            result.className = "ux-unselect"
        }
        return result;
    }
    inputData.forEach(category => {
        const {__connect, ...rest} = category;
        if (__connect && group[__connect.tree]) {
            let groupData = group[__connect.tree];
            if (__Zn.isArray(groupData)) {
                // 读取连接子节点
                let filtered = groupData.filter(item => {
                    if (__connect.code) {
                        return __connect.code === item.code;
                    } else return true;
                });
                // 拷贝即将添加的数据
                const $filtered = __Zn.clone(filtered);
                const {mode = "REPLACE"} = config;
                if ("REPLACE" === mode) {
                    // 不追加当前节点
                    if (category[treeConfig.parent]) {
                        $filtered.forEach(node => node[treeConfig.parent] = category[treeConfig.parent]);
                    }
                } else {
                    // 添加当前节点
                    normalized.push(calcAddon(rest));
                    // 不替换当前节点，直接作为当前节点的子节点
                    $filtered.forEach(node => node[treeConfig.parent] = category.key);
                }
                // 添加每一个节点
                const tree = forestSync($filtered, {mode}, group);
                if (__Zn.isArray(tree) && 0 < tree.length) {
                    tree.forEach(node => {
                        // 连接节点信息
                        normalized.push(calcAddon(node));
                        // 连接子树节点
                        const children = __Zn.elementChildren(groupData, node, treeConfig.parent);
                        if (__Zn.isArray(children) && 0 < children.length) {
                            children.forEach(child => normalized.push(calcAddon(child)));
                        }
                    });
                }
            }
        } else {
            /*
             * 不连接的正常数据
             */
            normalized.push(calcAddon(rest));
        }
    });
    return normalized;
}
const forest = (input = [], config = {}, group = {}) => {
    const {tree = {}, root} = config;
    const treeConfig = __TREE.toTreeConfig(tree);
    const inputData = input.filter(item => root === item.type);
    return forestGroup(inputData, group, types => {
        const typeSet = new Set(types);
        return __Zn.promise(input.filter(item => typeSet.has(item.type)));
    }).then((group = {}) => {
        const normalized = forestSync(inputData, {treeConfig, ...config}, group);
        return __Zn.promise(normalized).then(response => {
            // 返回值格式
            const {isTree = false} = config;
            if (isTree) {
                return __TREE.toTree(response, treeConfig);
            } else return __Zn.promise(response);
        })
    })
}
export default {
    forest,
    forestGroup
}