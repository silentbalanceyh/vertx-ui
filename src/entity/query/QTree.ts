/*
 * 查询节点
 */
import QTreeBranch from "./QTreeBranch";
import Qt from "./Qt";

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
        this.root = this._reckon(tree, () => Qt.join(this.root, tree.root, isAnd));
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