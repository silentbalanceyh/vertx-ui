import Ux from "ux";

const yiPSetPage = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}
const yoPSelected = (reference, inherit = {}, permSetData = {}) => {
    /*
     * $keySet「已选择的$keySet集合」（当前角色拥有的权限集）
     * $permissions「所有当前角色包含的权限数据」（当前角色拥有的所有权限）
     * $treeData：「权限集」当前系统中所有的权限集
     */
    const prevKeySet = reference.state.$keySet;
    const {
        $permissions,
        $treeData,
        $selectedKeys, $selectedData = []
    } = reference.state;
    if (prevKeySet && $permissions) {

        /*
         * 计算目前存在的所有 codes 集合
         * -- keySet：已选择的权限主键集
         */
        const permCodeSet = new Set();
        const $keySetPerm = new Set();
        $permissions
            /* 过滤已选择的数据 */
            .filter(permission => prevKeySet.has(permission.key))
            .forEach(permission => {
                permCodeSet.add(permission.code);
                $keySetPerm.add(permission.key);
            })

        /*
         * 先构造当前分类下的权限集，分类的 key
         * config.key 就是类型主键
         *
         * -- permKeySet：已选择的权限集主键集
         */
        const {config = {}} = permSetData;
        const $keySet = new Set();

        $treeData
            .filter(permSet => permSet.type === config.key)
            .filter(permSet => permCodeSet.has(permSet.code))
            // 专用的 name -> MD5 生成 $keySet
            .forEach(permSet => $keySet.add(Ux.encryptMD5(permSet.name)))
        /*
         * $keySet：权限集 key 集合
         * $keySelected：权限 key 集合
         */
        inherit.$keySet = $keySet;
        inherit.$keyPerm = prevKeySet;

        const {$treeGroup = {}} = reference.state;
        /*
         * 当前组的默认数据
         */
        const $keyGroup = $treeGroup[config.key];
        inherit.$keyGroup = $keyGroup ? $keyGroup : []; // 分组过后的权限集数据
        inherit.$permissions = $permissions;            // 全部权限数据
        {
            inherit.$selectedKeys = $selectedKeys;
            inherit.$selectedData = $selectedData;
        }
    }
}
const rxCheck = (reference) => (result = {}) => {
    const {$keyGroup, $keySet, $permissions = []} = reference.props;
    /*
     * 读取当前这一组所有的权限 key 信息
     * 1）$keySet - keys（反选结果）
     * 2）keys - $keySet（选中的结果）
     */
    const setNow = new Set(result.checked);
    const setOld = $keySet;

    /*
     * 转换成权限的 code = key
     */
    const addedSet = new Set();
    const removedSet = new Set();
    $keyGroup.forEach(each => {
        const eachKey = Ux.encryptMD5(each.name);
        if (!setOld.has(eachKey) && setNow.has(eachKey)) {
            addedSet.add(each.code);
        }
        if (setOld.has(eachKey) && !setNow.has(eachKey)) {
            removedSet.add(each.code);
        }
    });
    const addedKeys = $permissions.filter(item => addedSet.has(item.code)).map(item => item.key);
    const removedKeys = $permissions.filter(item => removedSet.has(item.code)).map(item => item.key);
    Ux.fn(reference).rxCheck(addedKeys, removedKeys);
}
const rxSelect = (reference) => (item = []) => {
    const setKey = item[0];
    if (setKey) {
        const {$keyGroup = [], $permissions = []} = reference.props;
        const codeSet = new Set();
        $keyGroup.forEach(each => {
            const eachKey = Ux.encryptMD5(each.name);
            if (setKey === eachKey) {
                codeSet.add(each.code);
            }
        })
        const $selectedData = $permissions.filter(item => codeSet.has(item.code));
        Ux.fn(reference).rxSelect(setKey, $selectedData);
    }
}
const yoPSetTree = (reference) => {
    const {
        data = {},
        $keySet,
        $selectedKeys = []
    } = reference.props;
    const {items = []} = data;

    const treeAttrs = {};
    treeAttrs.treeData = items;
    treeAttrs.checkable = true;
    treeAttrs.defaultExpandAll = true;
    treeAttrs.checkStrictly = true;
    treeAttrs.disabled = !data.entity;

    treeAttrs.onCheck = rxCheck(reference);     // 选择多个
    treeAttrs.onSelect = rxSelect(reference);   // 单独选择

    if ($keySet) {
        treeAttrs.checkedKeys = Array.from($keySet);
    }
    treeAttrs.selectedKeys = $selectedKeys;
    return treeAttrs;
}
const rxPermCheck = (reference, item = {}) => (event) => {
    const checked = event.target.checked;
    const addedKeys = [];
    const removedKeys = [];
    if (checked) {
        addedKeys.push(item.key);
    } else {
        removedKeys.push(item.key);
    }
    Ux.fn(reference).rxCheck(addedKeys, removedKeys);
}
export default {
    yiPSetPage,
    yoPSelected,
    // 提取 Tree 中需要使用的 yoKeysChecked 数据
    yoPSetTree,
    rxPermCheck,
}