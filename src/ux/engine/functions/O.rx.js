/*
 * 根据分辨率计算核心高度
 * 1）width > 1400 的宽度：默认 - 48
 * 3）width > 1900 的宽度：默认 - 56
 */
import T from "./O.to";
import Abs from '../../abyss';
import {Dsl} from "entity";
import Ele from '../../element';

/**
 * ## 「标准」`Ux.rxResize`
 *
 * 设置窗口 resize 的事件专用。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Function} 返回 resize 回调函数。
 */
function rxResize(reference) {
    if (2 === arguments.length) {
        // 第二种用法
        return () => {
            const state = T.toHeightState(arguments[1]);
            reference.setState(state);
        }
    } else {
        // 目前存在的用法
        return (adjust = 0) => {
            const state = T.toHeightState(adjust);
            reference.setState(state);
        };
    }
}

/**
 * ## 「标准」`Ux.rxCheckedRow`
 *
 * 表格 Table 中的专用 selected 函数生成器。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} field 字段名称。
 * @returns {Function} 选中函数。
 */
const rxCheckedRow = (reference, field = "$selected") => (keys = []) => {
    let state = reference.state ? reference.state : {};
    state = Abs.clone(state);
    const {$data = []} = state;
    const $selected = state[field] ? state[field] : [];
    if (0 < $data.length) {
        const selected = $data.filter(item => keys.includes(item.key));
        /*
         * DataArray
         */
        const original = Dsl.getArray($selected);
        selected.forEach(each => original.saveElement(each));
        const checked = original.to();
        /*
         * Checked item
         */
        state[field] = checked ? checked : [];
        reference.setState(state);
    }
};
/**
 *
 * ## 「标准」`Ux.rxCheckedTree`
 *
 * 树专用组件 Tree 中的专用选择函数，借助 $keySet 集合
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} input 当前组中数组，本身为一棵树
 * @param {Function} callback 回调函数
 * @returns {Function} 选中函数。
 */
const rxCheckedTree = (reference, input = [], callback) => (keys = [], item) => {
    let current = [];
    const exclude = []
    Abs.itTree(input, item => {
        current.push(item.key);
        /*
         * 必须是 false 的情况，否则会将 undefined 的情况也统计在
         * exclude 过程中导致选择失效
         */
        if (false === item.checkable) {
            exclude.push(item.key);
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
    if (Abs.isArray(keys)) {
        // checkStrictly = false
        keys.forEach(key => keySet.add(key));
    } else {
        // checkStrictly = true
        const checkedKeys = Abs.clone(keys.checked);
        // 将选中项设置
        checkedKeys.forEach(key => keySet.add(key));
        {
            // 根据当前节点联动
            const flatted = Ele.elementFlat(input);
            const {node} = item;
            if (node) {
                const {data = {}} = node.props;
                if (item.checked) {
                    // 当前节点被选中
                    const children = Ele.elementChildren(flatted, data);
                    children.forEach(each => keySet.add(each.key));
                    // 选择当前节点的父节点
                    const branch = Ele.elementBranch(flatted, data.key);
                    branch.forEach(each => keySet.add(each.key));
                } else {
                    // 当前节点被反选
                    const children = Ele.elementChildren(flatted, data);
                    children.forEach(each => keySet.delete(each.key));
                    /*
                     * 反选需要检查父节点的兄弟节点
                     * 兼容性读取：parent / parentId
                     */
                    const parents = [];
                    {
                        // parentId 的分树
                        const branchId = Ele.elementParent(flatted, data.key);
                        // parent标准分树
                        const branch = Ele.elementParent(flatted, data.key, "parentId");
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
                        const children = Ele.elementChildren(flatted, parent);
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
    if (Abs.isFunction(callback)) {
        const append = callback(keySet);
        if (append) {
            Object.assign(state, append);
        }
    }
    reference.setState(state);
}
export default {
    rxResize,
    rxCheckedRow,
    rxCheckedTree
}