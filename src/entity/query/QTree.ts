import QNode from "./QNode";
import QBranch from "./QBranch";
import QLeaf from "./QLeaf";
import QConstants from "./QConstant";
class QTree {
    private reference: QNode = null;
    constructor(reference: QNode) {
        if (reference) {
            this.reference = reference;
        }
    }

    private add(field: string, value: any, op: string): QTree {
        if (this.reference) {
            const added = new QLeaf(field, value);
            this.reference = new QBranch(this.reference, added, op);
        } else {
            this.reference = new QLeaf(field, value);
        }
        return this;
    }

    and(field: string, value: any): QTree {
        return this.add(field, value, QConstants.Conj.AND);
    }

    or(field: string, value: any): QTree {
        return this.add(field, value, QConstants.Conj.OR);
    }

    connect(tree: QTree, op: string): QTree {
        const ref: QNode = tree.ref();
        const thisRef: QNode = this.ref();
        this.reference = new QBranch(ref, thisRef, op);
        return this;
    }

    to() {
        if (!this.reference) {
            console.warn(
                "[TS-VI] Current query tree has not been initialized. reference = ",
                this.reference
            );
        }
        return this.reference.to();
    }

    ref(): QNode {
        return this.reference;
    }

    static direct(criterias: any, op: any): QTree {
        if (!criterias || 0 === Object.keys(criterias).length) {
            console.warn(
                "[TS-VI] Could not create query tree because of invalid parameters. criterias = ",
                criterias
            );
        }
        if (op) {
            // 如果为true表示or的关系
            op = QConstants.Conj.OR;
        } else {
            op = QConstants.Conj.AND;
        }
        let tree = null;
        for (const key in criterias) {
            const node = new QLeaf(key, criterias[key]);
            if (tree) {
                if (QConstants.Conj.AND === op) {
                    tree = tree.and(key, criterias[key]);
                } else {
                    tree = tree.or(key, criterias[key]);
                }
            } else {
                tree = new QTree(node);
            }
        }
        return tree;
    }
}

export default QTree;
