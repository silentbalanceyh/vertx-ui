import actions from './Op.Event';
import Ex from "ex";
import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    /*
     * 读取所有的权限组信息
     * 读取所有的权限信息
     */
    Ex.authTreeRes(state).then(middle => Ex.authGroups(state, middle.$treeData).then(response => Ux.ajaxGet("/api/permission/by/sigma").then(permissions => {
        const {$groups} = response;
        // 按组分权限
        const grouped = Ux.elementGroup(permissions, 'identifier');
        $groups.forEach(each => {
            if (grouped.hasOwnProperty(each.identifier)) {
                const groupedBy = grouped[each.identifier];
                each.children = Ux.clone(groupedBy.filter(item => each.group === item.group))
            }
        })
        const category = Ux.clone(middle.$treeData);
        const treeRef = [];

        // ----------------- 数据构造 ----------------------
        category.forEach(cat => {
            const filtered = $groups.filter(item =>
                cat.identifier === item.identifier
            );
            /* 先把数据连接到 cat 上 */
            if (filtered) {
                const treeItem = Ux.clone(cat);     // 资源类型
                treeItem.checkable = false;    // 资源类型一律不允许选择
                treeRef.push(treeItem);        // 资源类型
                filtered.forEach(group => {
                    const {children, ...rest} = group;
                    rest.name = rest.group;
                    rest.parentId = cat.key;
                    const groupKey = Ux.randomUUID();
                    rest.key = groupKey;
                    treeRef.push(rest);             // 权限组
                    // group children
                    if (children) {
                        children.forEach(child => {
                            child.parentId = groupKey;
                            treeRef.push(child);    // 权限
                        })
                    }
                })
            }
        })

        // ----------------- 构造树形结构 ----------------------
        const permTree = Ux.toTree(treeRef, {title: "name"})
            .filter(item => item.hasOwnProperty('data'))
            .filter(item => item.data.code)
            // 过滤掉集成部分
            .filter(item => !item.data.code.startsWith(Ex.V.PERM_INTEGRATION));
        /*
         * 系统组 / 业务组
         */
        const types = Ux.immutable(Ex.V.PERM_TREE_SYSTEM)
        const $source = {};
        $source.business = permTree
            .filter(item => !types.contains(item.data.code));
        $source.system = permTree
            .filter(item => types.contains(item.data.code));
        response.$source = $source;
        return Ux.promise(response);
    }))).then(Ux.ready).then(Ux.pipe(reference))
}
export default {
    yiPage,
    actions,
}