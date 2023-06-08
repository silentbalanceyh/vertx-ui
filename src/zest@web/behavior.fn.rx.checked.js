import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const rxCheckedRow = (reference, field = Cv.K_NAME.SELECTED) => (keys = []) => {
    let state = reference.state ? reference.state : {};
    state = __Zn.clone(state);
    const {$data = []} = state;
    if (0 < $data.length) {
        const selected = $data.filter(item => keys.includes(item.key));
        // const original = Dsl.getArray($selected);
        // selected.forEach(each => original.saveElement(each));
        // let checked = original.to();
        // 此处适配多选，所以旧代码不能保留
        state[field] = selected ? selected : [];
        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    }
};

const rxCheckedTree = (reference, input = [], callback) => (keys = [], item) => {
    let current = [];
    const exclude = [];
    __Zn.itTree(input, each => {
        current.push(each.key);
        /*
         * 必须是 false 的情况，否则会将 undefined 的情况也统计在
         * exclude 过程中导致选择失效
         */
        if (false === each.checkable) {
            exclude.push(each.key);
        }
    });
    // 先找到当前 checkedKeys 所在的组
    let {$keySet} = reference.state;
    const keySet = new Set();
    // 读取最原始的
    if ($keySet) {
        Array.from($keySet).forEach(key => keySet.add(key))
    }

    // 减掉当前 current 部分
    current.forEach(key => keySet.delete(key));

    // 追加 keys 部分
    if (__Zn.isArray(keys)) {
        // checkStrictly = false
        keys.forEach(key => keySet.add(key));
    } else {
        // checkStrictly = true
        const checkedKeys = __Zn.clone(keys.checked);
        // 将选中项设置
        checkedKeys.forEach(key => keySet.add(key));
        {
            // 根据当前节点联动
            const flatted = __Zn.elementFlat(input);
            const {node} = item;
            if (node) {
                // Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.
                // const {data = {}} = node.props;
                const data = node;
                if (item.checked) {
                    // 当前节点被选中
                    const children = __Zn.elementChildren(flatted, data);
                    children.forEach(each => keySet.add(each.key));
                    // 选择当前节点的父节点
                    const branch = __Zn.elementBranch(flatted, data.key);
                    branch.forEach(each => keySet.add(each.key));
                } else {
                    // 当前节点被反选
                    const children = __Zn.elementChildren(flatted, data);
                    children.forEach(each => keySet.delete(each.key));
                    /*
                     * 反选需要检查父节点的兄弟节点
                     * 兼容性读取：parent / parentId
                     */
                    const parents = [];
                    {
                        // parentId 的分树
                        const branchId = __Zn.elementParent(flatted, data.key);
                        // parent标准分树
                        const branch = __Zn.elementParent(flatted, data.key, "parentId");
                        branchId.concat(branch).forEach(parent => parents.push(parent));
                    }
                    /*
                     * 构造函数，针对当前父类的每个类执行递归检查
                     * 逆序检查，先检查父类，然后父类被移除过后，再检查当前类
                     * 这样才会导致最终的递归效果。
                     */
                    parents.reverse().forEach(parent => {
                        /*
                         * 查找同层兄弟节点
                         */
                        const children = __Zn.elementChildren(flatted, parent);
                        const selected = children.filter(item => keySet.has(item.key));

                        if (0 === selected.length) {
                            /*
                             * 无子节点选中，则直接取消父节点
                             */
                            keySet.delete(parent.key);
                        }
                    })
                }
            }
        }
    }
    // 移除不可选的
    Array.from(exclude).forEach(key => keySet.delete(key));
    const state = {};
    state.$keySet = keySet;
    if (__Zn.isFunction(callback)) {
        const append = callback(keySet);
        if (append) {
            Object.assign(state, append);
        }
    }
    __Zn.of(reference).in(state).done();
    // reference.?etState(state);
}
export default {
    rxCheckedTree,
    rxCheckedRow
}