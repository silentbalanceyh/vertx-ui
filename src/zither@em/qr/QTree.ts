/*
 * 查询节点
 */
import QTreeBranch from "./QTreeBranch";
import QTreeNode from "./QTreeNode";
import QTreeLeaf from "./QTreeLeaf";


const __qtLeft = (left: QTreeNode, right: QTreeLeaf) => {
    if (right.deleted()) {
        if (left instanceof QTreeBranch) {
            const hitted = left as QTreeBranch;
            hitted.getNodes().forEach(hittedItem => __qtLeft(hittedItem, right));
        } else {
            const leaf = left as QTreeLeaf;
            /*
             * 只比较条件，不比较值
             */
            if (leaf.isSame(right)) {
                /*
                 * field,op 部分相等，而值不相等
                 */
                leaf.saveNode(right);
            }
        }
    }
};

const __qtUpdate = (left: QTreeBranch, right: QTreeNode) => {
    if (right instanceof QTreeBranch) {
        const hitted = right as QTreeBranch;
        hitted.getNodes().forEach(hittedItem => __qtUpdate(left, hittedItem));
    } else {
        __qtLeft(left, right as QTreeLeaf);
    }
};

const __qtJoin = (left: QTreeBranch, right: QTreeBranch,
                  isAnd: Boolean = false): QTreeBranch => {
    /*
     * 构造新的树处理
     */
    const branch = new QTreeBranch({"": isAnd});
    /*
     * 删除节点的更新
     */
    __qtUpdate(left, right);
    /*
     * 比较左树和右树
     */
    if (isAnd) {
        /*
         * left 和 right 使用 AND 连接符
         * ( a AND b ) AND ( c AND d )
         * ( a AND b ) AND ( c OR  d )
         * ( a OR  b ) AND ( c AND d )
         * ( a OR  b ) AND ( c OR  d )
         */
        if (left.isAnd()) {
            left.getNodes().forEach(node => branch.addNode(node));
        } else {
            branch.addNode(left);
        }
        if (right.isAnd()) {
            right.getNodes().forEach(node => branch.addNode(node));
        } else {
            branch.addNode(right);
        }
    } else {
        /*
         * left 和 right 使用 OR 连接符
         * ( a AND b ) OR ( c AND d )
         * ( a AND b ) OR ( c OR  d )
         * ( a OR  b ) OR ( c AND d )
         * ( a OR  b ) OR ( c OR  d )
         */
        if (left.isAnd()) {
            branch.addNode(left);
        } else {
            left.getNodes().forEach(node => branch.addNode(node));
        }
        if (right.isAnd()) {
            branch.addNode(right);
        } else {
            right.getNodes().forEach(node => branch.addNode(node));
        }
    }
    return branch;
};

class QTree {
    /*
     * isComplex = true
     */
    private root: QTreeBranch;
    private isValid: Boolean = false;

    constructor(input: any) {
        const branch = new QTreeBranch(input);
        if (branch.valid()) {
            this.root = branch;
            this.isValid = true;
        }
    }

    to() {
        if (this.isValid) {
            return this.root.to();
        } else {
            throw new Error("[ Qr ] 不合法的树不可调 to()")
        }
    }

    /*
     * 两个 QTree 直接连接
     */
    join(tree: QTree, isAnd: Boolean = true): QTree {
        this._reckon.bind(this);
        this.root = this._reckon(tree, () => __qtJoin(this.root, tree.root, isAnd));
        return this;
    }

    valid() {
        return this.isValid;
    }

    private _reckon(input: QTree, supplier: Function): QTreeBranch {
        if (input.valid()) {
            if (this.isValid) {
                this.root = supplier();
            } else {
                this.root = input.root;
            }
            this.isValid = true;
        }
        return this.root;
    }
}

export default QTree;