import QTreeNode from './QTreeNode';
import QTreeLeaf from "./QTreeLeaf";
import __Zn from '../zero.module.dependency';

const __qtBranch = (content: any = {}, node: QTreeBranch, keyIfMore: any) => {
    const nodeContent = node.to();
    if (1 < node.getNodes().length &&
        /*
         * 防止 nodeContent = {} 而生成
         * $x = {} 的查询条件：500 Error
         */
        0 < Object.keys(nodeContent).length) {
        /*
         * 长度大于1，即子树不升级，那么启用 keyIfMore
         */
        content[keyIfMore] = nodeContent;
    } else {
        /*
         * 长度 == 1，直接合并
         */
        Object.assign(content, nodeContent);
    }
};
const __qtCombine = (nodes: Array<QTreeNode>, _isAnd: Boolean) => {
    const content: any = {};
    const validNodes = nodes.filter(node => node.valid());
    /*
     * 递归合并处理
     * 1）只有 validNodes 的长度 > 0 时会执行
     */
    if (0 < validNodes.length) {
        /*
         * 长度为1的处理
         */
        if (1 === validNodes.length) {
            const node: QTreeNode = validNodes[0];
            if (node instanceof QTreeLeaf) {
                /*
                 * 如果是叶节点，直接合并
                 */
                Object.assign(content, node.to())
            } else {
                __qtBranch(content, node as QTreeBranch, "$0");
            }
        } else {
            content[""] = _isAnd;       // 这种情况才处理操作符
            validNodes.forEach((node, index) => {
                if (node instanceof QTreeLeaf) {
                    const merged = node.to();
                    Object.assign(content, merged);
                } else {
                    const key = `$${index}`;
                    __qtBranch(content, node as QTreeBranch, key);
                }
            });
            /*
             * 计算完成后检查
             * 1）所有子节点为 __DELETE__ 被删除
             * 2）仅保留了操作符号位
             * 防止单节点出现：
             * {
             *     "": true
             * }
             * 或
             * {
             *     "": false
             * }
             * 500 Error
             */
            if (1 === Object.keys(content).length && content.hasOwnProperty("")) {
                delete content[""];
            }
        }
    }
    return content;
};

class QTreeBranch implements QTreeNode {
    private isValid: Boolean = false;
    private readonly nodes: Array<QTreeNode> = [];
    private readonly _isAnd: boolean = true;

    constructor(input: any = {}) {
        /* 不传入 input 则默认为 false */
        this._isAnd = input[""] ? input[""] : false;
        /* 迭代 */
        Object.keys(input)
            .filter(field => "" !== field)
            .filter(field => undefined !== input[field])
            .forEach(field => {
                /*
                 * 解析每一个节点
                 */
                const value = input[field];
                // @ts-ignore
                if (__Zn.isObject(value) && !__Zn.isArray(value)) {
                    /*
                     * 只能是 JsonObject
                     */
                    const branch = new QTreeBranch(value);
                    this.nodes.push(branch);
                } else {
                    const leaf = new QTreeLeaf(field, value);
                    this.nodes.push(leaf);
                }
            });
        this.isValid = (0 < this.nodes.length);
    }

    isAnd() {
        return this._isAnd;
    }

    to() {
        return __qtCombine(this.nodes, this._isAnd);
    }

    leaf() {
        return false;
    }

    valid() {
        return this.isValid;
    }

    /*
     * 读取所有的节点
     */
    getNodes(): Array<QTreeNode> {
        return this.nodes;
    }

    /*
     * 添加单个节点
     */
    addNode(node: QTreeNode): QTreeBranch {
        if (node.valid()) {
            this.nodes.push(node);
            this.isValid = 0 < this.nodes.length;
        }
        return this;
    }
}

export default QTreeBranch;
