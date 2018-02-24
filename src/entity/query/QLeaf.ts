import QNode from "./QNode";
import QHelper from "./QHelper";
class QLeaf implements QNode {
    private field: string = "";
    private op: string = "";
    private mode: string;
    private value: any;
    constructor(field: string, value: any) {
        if (field && value) {
            const result: any = QHelper.fnParseField(field, value);
            this.field = result.field;
            this.value = result.value;
            this.op = result.op;
            if (result.mode) {
                this.mode = result.mode;
            }
        } else {
            console.warn(
                "[TS-VI] QLeaf missed parameter 'field' or 'value', could not be built."
            );
        }
    }
    to(): Object {
        const result: any = {};
        // 针对二元操作符
        if ("NIL" === this.op || "NNL" === this.op) {
            result[this.op] = this.field;
        } else {
            result[this.field] = this.value;
            result["$OP$"] = this.op;
            if (this.mode) {
                result["$MODE$"] = this.mode;
            }
        }
        // 可删除OP的操作符
        if ("EQ" === this.op || "LIKE" === this.op || "IN" === this.op) {
            delete result["$OP$"];
        }
        return result;
    }

    is(): boolean {
        let result = false;
        if (this.field && this.op && this.value) {
            result = true;
        }
        return result;
    }
}

export default QLeaf;
