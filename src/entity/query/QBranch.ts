import QNode from "./QNode";
import QConstant from "./QConstant";
class QBranch implements QNode {
    private left: QNode;
    private right: QNode;
    private op: string;
    constructor(left: QNode, right: QNode, op: any) {
        this.left = left;
        this.right = right;
        this.op = op;
    }

    to(): Object {
        const result: any = {};
        result["$LEFT$"] = this.left.to();
        result["$RIGHT$"] = this.right.to();
        if (QConstant.Conj.OR === this.op) {
            result["$OP$"] = this.op;
        }
        return result;
    }

    is(): boolean {
        let result = false;
        if (this.left && this.right && this.op) {
            result = true;
        }
        return result;
    }
}

export default QBranch;
