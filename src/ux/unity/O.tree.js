import Abs from '../abyss';
import Ele from '../element';
import To from './O.tree.to';

class Tree {
    /*
     * 绑定专用的 React 的 reference
     */
    constructor(reference) {
        this.reference = reference;
    }

    /*
     * 构造树的内部结构
     * $treeData -> 原始数组
     * $tree -> 树相关信息
     */
    build(dataArray = [], config = {}) {
        const $treeArray = Abs.clone(dataArray);
        this.$treeData = $treeArray;
        if (!config.hasOwnProperty('title')) {
            config.title = "name";
        }
        this.$tree = To.toTree($treeArray, config);
        this.$config = config;
        return this;    // 返回当前引用
    }

    /*
     * 获取树的根节点信息（剔除掉 children）
     * @param {boolean} children 是否保留节点下的 children 节点
     * @param {boolean} blade 扁平树，如果 blade 为 true，那么直接把所有子节点收起来
     */
    getRoots(children = false, blade = false) {
        const tree = Abs.clone(this.$tree);
        const source = Abs.clone(this.$treeData);
        const normalized = [];
        tree.forEach(node => {
            const $node = Abs.clone(node);
            if (children) {
                /* children 重算 */
                if (blade) {
                    /* 直接拉平处理 */
                    const childArr = Ele.elementChildren(source, node, "parentId");
                    childArr.forEach(child => {
                        if (child.children) {
                            delete child.children;
                        }
                        // 重新挂树
                        child.parentId = node.key;
                    });
                    /* treeArray */
                    $node.children = childArr;
                }
            } else {
                // 删除 children
                delete $node.children;
            }
            normalized.push($node);
        });
        return normalized;
    }
}

export default (reference) => new Tree(reference)