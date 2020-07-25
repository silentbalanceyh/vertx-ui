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
 * ## 标准函数
 *
 * 设置窗口 resize 的事件专用。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Function} 返回 resize 回调函数。
 */
function rxResize(reference) {
    if (2 === arguments.length) {
        // 第二种用法
        return () => {
            const maxHeight = T.toHeight("number" === typeof arguments[1] ? arguments[1] : 0);
            let $heightStyle = {style: {maxHeight}};
            reference.setState({$heightStyle});
        }
    } else {
        // 目前存在的用法
        return (adjust = 0) => {
            const maxHeight = T.toHeight("number" === typeof adjust ?
                adjust : 0);
            let $heightStyle = {style: {maxHeight}};
            reference.setState({$heightStyle});
        };
    }
}

/**
 * ## 引擎函数
 *
 * 表格 Table 中的专用 selected 函数生成器。
 *
 * @memberOf module:_rx
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
        const $keys = Abs.immutable(keys);
        const selected = $data.filter(item => $keys.contains(item.key));
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
 * ## 引擎函数
 *
 * 树专用组件 Tree 中的专用选择函数，借助 $keySet 集合
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} input 当前组中数组，本身为一棵树
 * @returns {Function} 选中函数。
 */
const rxCheckedTree = (reference, input = []) => (keys = [], item) => {
    let current = [];
    Abs.itTree(input, item => current.push(item.key));
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
            const flatted = Ele.elementFlat(input, "children", true);
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
                }
            }
        }
    }
    reference.setState({$keySet: keySet});
}
export default {
    rxResize,
    rxCheckedRow,
    rxCheckedTree
}