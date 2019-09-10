import QTreeNode from './QTreeNode';
import * as U from 'underscore';
import QTreeLeaf from "./QTreeLeaf";

const _findRef = (nodes: Array<QTreeNode>, hit: QTreeLeaf, isFull: Boolean = false): QTreeLeaf => {
    let reference: QTreeLeaf;
    nodes.forEach(node => {
        if (node instanceof QTreeLeaf) {
            /*
             * 引用处理
             */
            if (node.isSame(hit, isFull)) {
                reference = node;
            }
        } else {
            const branch = node as QTreeBranch;
            reference = _findRef(branch.getNodes(), hit, isFull);
        }
    });
    return reference;
};
/*
 * 从 nodes 中删除 hit
 */
const _removeRef = (nodes: Array<QTreeNode>, hit: QTreeLeaf) => {

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
                if (U.isObject(value) && !U.isArray(value)) {
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
        const content: any = {};
        const validNodes = this.nodes.filter(node => node.valid());
        if (0 < validNodes.length) {
            if (1 === validNodes.length) {
                const node: QTreeNode = validNodes[0];
                if (node instanceof QTreeLeaf) {
                    /*
                     * 如果是叶节点，直接合并
                     */
                    Object.assign(content, node.to())
                } else {
                    content[`$0`] = node.to();
                }
            } else {
                content[""] = this._isAnd;       // 这种情况才处理操作符
                validNodes.forEach((node, index) => {
                    if (node instanceof QTreeLeaf) {
                        const merged = node.to();
                        Object.assign(content, merged);
                    } else {
                        const key = `$${index}`;
                        content[key] = node.to();
                    }
                });
            }
        }
        return content;
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
