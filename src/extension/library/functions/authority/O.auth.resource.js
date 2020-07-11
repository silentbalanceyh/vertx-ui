import Ajx from '../../ajax';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 1. 根据传入的 treeData 提取 resource.tree 构造分类
 * 2. 读取远程的权限组，权限组挂在分类下边
 */
const authGroups = (state = {}, treeData = []) => {
    /* 权限组读取 */
    return Ux.ajaxGet("/api/permission/groups/by/sigma", {}).then(groups => {
        /*
         * 根节点，先针对分组
         * 组名称 -> identifier 集合
         */
        const groupMap = {};
        const groupVector = {};
        groups.forEach(group => {
            const groupRef = groupMap[group.group];
            if (groupRef) {
                groupRef.total += group.count;
            } else {
                const $group = Ux.clone(group);
                $group.total = $group.count;
                groupMap[group.group] = $group;
            }
            groupVector[group.identifier] = group.group;
        });
        /*
         * 构造树
         */
        const tree = Ux.tree().build(treeData);
        /*
         * 读取拉平的树
         */
        const treeRoot = tree.getRoots(true, true);
        /*
         * children 节点引入替换机制
         */
        const processed = [];
        const childMap = {};
        treeRoot.forEach(root => {
            const childArr = [];
            const $root = Ux.clone(root);
            if ($root.children) {
                $root.children.forEach(child => {
                    /*
                     * 直接从 groupMap 中查找
                     */
                    const groupName = groupVector[child.identifier];
                    if (groupName) {
                        const groupData = groupMap[groupName];
                        if (groupData) {
                            if (!childMap.hasOwnProperty(groupData.group)) {
                                child.name = `${groupData.group}（${groupData.total}）`;
                                child.__group = Ux.clone(groupData);
                                child.__parent = Ux.clone($root.data);
                                childArr.push(child);
                                childMap[groupData.group] = true;
                            }
                        }
                    }
                });
                $root.children = Ux.toTreeArray(childArr, {title: "name"});
            }
            processed.push($root);
        })
        state.$groups = Ux.clone(groups);
        state.$tree = processed;
        return Ux.promise(state);
    })
}
/**
 *
 * ## 扩展函数
 *
 * 1. 直接读取 resource.tree 中的内容
 * 2. 遇到 ID:XXX 需要执行判断，进行深度树的二次读取
 * 3. 最终构造完成的树形数组（parentId一致）
 */
const authTreeRes = (state = {}) => {
    /* resource.tree */
    return Ajx.category({type: "resource.tree"}).then(categories => {
        /*
        * 资源基本信息
        * - 处理资源分类表
        * 1）以 resource 开头作为基本分类数据
        * 2）分类之下的子数据作为 identifier 的过滤信息
        * */
        const treeData = Ux.clone(categories);
        const children = [];        // 子节点 promise
        categories.filter(category => "ID:X_CATEGORY" === category.identifier).forEach(category => {
            /*
             * 查询子节点
             */
            children.push(Ajx.category({type: category.code})
                .then(childData => {
                    childData.filter(child => !child.parentId)
                        .forEach(item => item.parentId = category.parentId)
                    return Ux.promise(childData);
                })
            );
        });
        return Ux.parallel(children).then((matrix = []) => {
            matrix.forEach(eachArray => eachArray.forEach(item => treeData.push(item)));
            /*
             * $treeData: 原始数组
             * $tree：构造过后的树
             */
            const $treeData = treeData
                // 去掉已经替换的节点信息
                .filter(category => "ID:X_CATEGORY" !== category.identifier)
            state.$treeData = $treeData;
            state.$tree = Ux.toTree($treeData, {
                title: "name"
            });
            return Ux.promise(state);
        });
    })
}
export default {
    authTreeRes,
    authGroups,
}