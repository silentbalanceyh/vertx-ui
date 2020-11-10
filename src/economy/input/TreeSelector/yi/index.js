import yiClick from './I.fn.click';
import Tree from './I.fn.tree';
import Ix from '../../../_internal/ix'
import Ux from "ux";

const yiDefault = (reference = {}) => {
    const {config = {}} = reference.props;
    /*
     * 各部分组件配置处理
     */
    const dialog = Ix.dialogConfig(reference, config);
    const onClick = yiClick(reference, config);
    const tree = Tree.yiTree(reference, config);
    return {
        onClick,
        dialog,
        tree,
        $ready: true
    }
};
const yiValue = (reference, jsx = {}) => {
    const inputAttrs = Ux.valueLimit(jsx);
    if (undefined === inputAttrs.value) {
        /*
         * 只有 undefined 的时候触发
         */
        const {$defaultValue} = reference.state;
        if ($defaultValue) {
            inputAttrs.value = $defaultValue;
        }
    }
    /*
     * display 显示处理
     */
    const {tree, $data = []} = reference.state;
    if (tree.checkable) {
        // 多选才执行
        if (inputAttrs.value && Ux.isArray(inputAttrs.value)) {
            const {config = {}} = reference.props;
            const {selection = {}} = config;
            if (selection.display) {
                const valueSet = new Set(inputAttrs.value);
                inputAttrs.value = $data
                    .filter(item => valueSet.has(item.key))
                    .map(item => item[selection.display]);
            }
        }
    }
    return inputAttrs;
};
export default {
    yiDefault,
    yiValue,
    /*
     * Tree 操作中的三个核心方法
     * 1) - yiTree
     * 2) - yoTree
     * 3) - yoTreeData
     */
    yoTree: Tree.yoTree,
    yoTreeData: Tree.yoTreeData,
}