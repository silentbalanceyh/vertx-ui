import Ux from 'ux';
// 跳级处理
import Ajx from '../../ajax';
import Cv from '../../functions/global';

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
         * 构造树
         */
        const tree = Ux.tree().build(treeData);
        /*
         * 读取拉平的树
         */
        const treeRoot = tree.getRoots(true, true);

        /*
         * 集成节点处理
         */
        const itemRef = Ux.elementUnique(treeData, 'code', Cv.V.PERM_INTEGRATION);
        const exclude = [];
        if (itemRef) {
            const {group = []} = itemRef.metadata ? itemRef.metadata : {};
            if (Ux.isArray(group)) {
                group.forEach(each => exclude.push(each));
            }
        }
        const $integration = Ux.immutable(exclude);
        /*
         * 根节点，先针对分组
         * 组名称 -> identifier 集合
         */
        const groupMap = {};
        const groupVector = {};
        groups.filter(each => !$integration.contains(each.group)).forEach(group => {
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
         * children 节点引入替换机制
         */
        const processed = [];
        const childMap = {};
        treeRoot.forEach(root => {
            const $root = Ux.clone(root);
            const {data = {}} = root;
            if (data.code === Cv.V.PERM_INTEGRATION) {
                // 集成专用
                let integrated = groups.filter(each => $integration.contains(each.group));
                integrated = Ux.elementGroup(integrated, 'group');
                // 集成中的组信息
                const childArr = [];
                Object.keys(integrated).forEach(groupName => {
                    // 节点数据
                    const child = {};
                    let count = 0;
                    const groupEach = integrated[groupName];
                    const identifiers = [];
                    if (Ux.isArray(groupEach)) {
                        groupEach.forEach(groupItem => {
                            count += Ux.valueInt(groupItem.count);
                            identifiers.push(groupItem.identifier);
                        })
                    }
                    child.name = `${groupName}（${count}）`;
                    child.parentId = root.key;
                    child.key = Ux.randomUUID();
                    child.identifier = identifiers;
                    child.__group = {group: groupName};
                    child.__parent = Ux.clone($root.data);
                    childArr.push(child);
                });
                $root.children = Ux.toTreeArray(childArr, {title: "name"});
                processed.push($root);
            } else {
                // 非集成处理
                const childArr = [];
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
            }
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
    return Ajx.forest("resource.tree").then(response => {
        state.$treeData = response;
        state.$tree = Ux.toTree(response, {
            title: "name"
        });
        return Ux.promise(state);
    })
}
export default {
    authTreeRes,
    authGroups,
}