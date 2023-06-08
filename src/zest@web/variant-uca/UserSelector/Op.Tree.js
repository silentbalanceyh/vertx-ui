import __Zn from "../zero.uca.dependency";

const _rxTreeKeys = (reference, keys = [], mode) => {
    let $keys;
    if ("DEPT" === mode) {
        $keys = __Zn.onDatum(reference, "user.departments")
            .map(item => item.key)
            .filter(item => keys.includes(item));
    } else if ("TEAM" === mode) {
        $keys = __Zn.onDatum(reference, "user.teams")
            .map(item => item.key)
            .filter(item => keys.includes(item));
    } else {
        $keys = __Zn.onDatum(reference, "ajax.groups")
            .map(item => item.key)
            .filter(item => keys.includes(item));
    }
    return $keys;
}

const _rxTree = (reference) => (keys = [], item = {}) => {
    // Fix: Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.
    const data = item.node ? item.node : {};

    let {$filters = {}, $config = {}} = reference.state;
    $filters = __Zn.clone($filters);
    $filters[""] = true;

    const condTree = $filters["$tree"] ? $filters["$tree"] : {};
    const {marker = {}} = $config;
    const {mode} = data.data ? data.data : {};
    const tips = marker[mode] ? marker[mode] : {};
    const field = tips.field;

    const $keys = _rxTreeKeys(reference, keys, mode);
    if (0 < $keys.length) {
        condTree[field] = $keys;
    } else {
        condTree[field] = "__DELETE__";
    }
    $filters["$tree"] = condTree;

    __Zn.of(reference).in({
        $filters
    }).loading(false).handle(() => {
        const {onClick} = reference.state;
        if (__Zn.isFunction(onClick)) {
            onClick();
        }
    }, 0)
    // reference.?etState({
    //     $filters, $loading: true
    // });
    // __Zn.toLoading(() => {
    //     const {onClick} = reference.state;
    //     if (__Zn.isFunction(onClick)) {
    //         onClick();
    //     }
    // })
}
export default (reference, config = {}, state) => {
    // 部门树 / 组树
    const {tree = {}, marker = {}} = config;
    const $keys = [];
    const deptData = __Zn.onDatum({state}, "user.departments");
    deptData.forEach(each => {
        each.parentId = each.deptId;
        each.mode = "DEPT";
        const icon = __Zn.configIcon(marker['DEPT']);
        if (icon) {
            each.icon = __Zn.v4Icon(icon);
        }
        $keys.push(each.key);
    });
    const teamData = __Zn.onDatum({state}, "user.teams");
    teamData.forEach(each => {
        if (each['teamId']) {
            each.parentId = each['teamId'];
        } else {
            each.parentId = each['deptId'];
        }
        each.mode = "TEAM";
        const icon = __Zn.configIcon(marker['TEAM']);
        if (icon) {
            each.icon = __Zn.v4Icon(icon);
        }
        $keys.push(each.key);
    })

    const deptTree = __Zn.toTree(deptData.concat(teamData), {
        parent: 'parentId',
        text: "name"
    });

    const $treeDept = {
        key: "rootDept",
        title: tree['dept'],
        checkable: false,
        children: deptTree
    }
    // 业务组配置
    const groupData = __Zn.onDatum({state}, "ajax.groups");
    groupData.forEach(each => {
        each.mode = "GROUP";
        const icon = __Zn.configIcon(marker['GROUP']);
        if (icon) {
            each.icon = __Zn.v4Icon(icon);
        }
        $keys.push(each.key);
    });
    const groupTree = __Zn.toTree(groupData, {
        parent: "parentId",
        text: 'name'
    })

    const $treeGroup = {
        key: 'rootGroup',
        title: tree['group'],
        checkable: false,
        children: groupTree,
    }

    const treeAttr = {};
    treeAttr.treeData = [
        $treeDept,
        $treeGroup
    ]
    treeAttr.defaultExpandAll = true;
    treeAttr.checkable = true;
    treeAttr.selectable = false;
    treeAttr.showIcon = true;
    // treeAttr.defaultCheckedKeys = $keys;
    // 修改 $filters
    treeAttr.onCheck = _rxTree(reference);
    return treeAttr;
}