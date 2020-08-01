import actions from './Op.Event';
import Ex from "ex";
import Ux from 'ux';
import renderChild from '../Web.Child';
import Dev from './Op.Tool';

const calcIntegration = (item = {}, permissions = []) => {
    /* 只支持1级 */
    const grouped = Ux.elementGroup(permissions, 'group');
    const children = [];
    Object.keys(grouped).forEach(groupName => {
        const groupNode = {};
        const key = Ux.randomUUID();
        groupNode.key = key;
        groupNode.name = groupName;
        groupNode.title = groupName;
        groupNode.parentId = item.key;
        const leafNodes = grouped[groupName];
        if (Ux.isArray(leafNodes)) {
            leafNodes.forEach(leaf => {
                leaf.parentId = key;
                leaf.title = leaf.name;
            });
        }
        groupNode.children = leafNodes;
        children.push(groupNode);
    });
    /* 读取原来的 children 信息，挂载第一颗树下边 */
    const original = Ux.clone(item.children);
    if (0 < original.length) {
        const parent = children[0];
        if (parent) {
            original.forEach(item => {
                // 提取 item.children
                item.parent = parent.key;
                parent.children.push(item);
            });
        }
    }
    item.children = children;
    item.checkable = false;
}
const calcCompress = (item = {}) => {
    if (item.children) {
        const replaced = [];
        item.children.forEach(child => {
            if (child.__delete) {
                const sons = child.children;
                sons.forEach(son => {
                    son.parentId = item.key;
                    replaced.push(son);
                });
            } else {
                calcCompress(child);
                replaced.push(child);
            }
        });
        if (0 < replaced.length) {
            item.children = replaced;
        }
    }
}
const calcCommon = (item = {}, permissions = {}) => {
    /* 支持多集 */
    const grouped = Ux.elementGroup(permissions, "identifier");
    /* 在 item 中查找 */
    Ux.itTree(item.children, (node = {}) => {
        const {checkable = true} = node;
        if (checkable) {
            const {data = {}} = node;
            const children = grouped[data.identifier];
            if (Ux.isArray(children)) {
                // 对接过的节点都在后期删除
                calcIntegration(node, children);
                // 原始的 node 中可能包含 children;
                node.__delete = true;
            }
        }
    });
    /* 全部提升一级，去掉顶层分类树 */
    item.checkable = false;
    /* 压缩树，根据 __delete 节点执行 */
    calcCompress(item);
}

const calcTree = (resource = {}, permissions = []) => {
    // 先处理集成部分，并且需要从原始数组中减掉集成部分
    const {data = {}} = resource;
    if (Ex.V.PERM_INTEGRATION === data.code) {
        // 计算集成类型的
        calcIntegration(resource, permissions);
    } else {
        // 非集成类型计算
        calcCommon(resource, permissions);
    }
    return resource;
}

const calcPermissions = (resource = [], permissions = []) => {
    // 子节点
    permissions.forEach(permission => permission.isLeaf = true);
    const groups = [];
    resource
        .map(item => item.data)
        .filter(data => !!data)
        .map(data => data.metadata)
        .filter(meta => !!meta)
        .map(meta => meta.group)
        .filter(group => !!group)
        .forEach(each => each.forEach(group => groups.push(group)));
    const $groups = Ux.immutable(groups);
    const result = {};
    // integration，必须设置
    result.integration = permissions.filter(item => $groups.contains(item.group));
    // common, 直接设置
    result.common = permissions.filter(item => !$groups.contains(item.group));
    return result;
}

const yiPage = (reference) => Ex.yiStandard(reference).then(state => {
    /*
     * 读取所有的权限组信息
     * 读取所有的权限信息
     */
    return Ex.authTreeRes(state).then(middle => {
        // 按组分权限
        const root = Ux.clone(middle.$tree);
        return Ux.ajaxGet("/api/permission/by/sigma").then(permissions => {
            state.$permissions = permissions;
            // 资源组
            const $source = {
                business: [],       // 业务权限
                system: [],         // 系统权限
            }
            // 针对 permissions 执行分组
            const permission = calcPermissions(root, permissions);
            root.forEach(resource => {
                resource.checkable = false; // 资源组不可被选中
                const {data = {}} = resource;
                if (data.code === Ex.V.PERM_INTEGRATION) {
                    // 集成组计算
                    $source.system.push(calcTree(resource, permission.integration));
                } else {
                    // 非集成组计算
                    const types = Ux.immutable(Ex.V.PERM_TREE_SYSTEM);
                    if (types.contains(data.code)) {
                        $source.system.push(calcTree(resource, permission.common));
                    } else {
                        $source.business.push(calcTree(resource, permission.common));
                    }
                }
            })
            middle.$source = $source;
            return Ux.promise(middle);
        }).then(processed => {
            const maxHeight = Ux.toHeight(ADJUST);
            processed.$heightStyle = {style: {maxHeight}};
            {
                // 窗口绑定
                Ex.uiDialog(reference)
                    .child(renderChild(reference))
                    .onMount(processed)
            }
            return Ux.promise(processed);
        }).then(processed => {
            const $op = {};
            $op.$opChecked = (current) => Ux.rxCheckedTree(reference, current);
            Object.keys(actions).forEach(key => {
                const executor = actions[key];
                if (Ux.isFunction(executor)) {
                    $op[key] = executor(reference);
                }
            })
            processed.$op = $op;
            return Ux.promise(processed);
        })
    })
}).then(Ux.ready).then(Ux.pipe(reference))

const ADJUST = 276;
const yoChoice = (reference, data = []) => {
    const checkedKeys = [];
    const {$keySet} = reference.state;
    if ($keySet) {
        const connect = [];
        Ux.itTree(data, item => connect.push(item.key));
        const $connect = Ux.immutable(connect);
        Array.from($keySet)
            .filter(key => $connect.contains(key))
            .forEach(key => checkedKeys.push(key));
    }
    return checkedKeys;
}
export default {
    ADJUST,
    yiPage,
    yoChoice,
    actions,
    ...Dev,
}