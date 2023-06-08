//
// @ts-ignore
import Ux from "ux";

interface QNode {
    // 是否子节点
    leaf(): boolean;

    // 是否合法节点
    valid(): boolean;

    // 返回 key = value
    sql(): String;
}

class QValue implements QNode {
    private readonly isValid: boolean = false;
    private readonly field: String = "";
    private readonly value: any;
    private readonly op: String = "";

    constructor(field: String, value: any) {
        if (field && undefined !== value) {
            const fieldData = Ux.parseField(field);
            this.field = fieldData.field
            this.op = fieldData.op;
            this.value = value;
            this.isValid = true;
        } else {
            throw new Error("[ Qr ] 传入的 `field` 或 `value` 不可为 null！");
        }
    }

    leaf = () => true;
    valid = () => this.isValid;

    sql() {
        if ("=" === this.op) {
            // 等于
            return `${this.field} = '${this.value}'`
        } else if ("<>" === this.op) {
            // 不等于
            return `${this.field} <> '${this.value}'`
        }
    }
}

class QBranch implements QNode {
    private isValid: boolean = false;
    private readonly nodes: Array<QNode> = [];
    private readonly _isAnd: boolean = true;

    constructor(input: any = {}) {
        this._isAnd = input[""] ? input[""] : false;
        Object.keys(input)
            .filter(field => "" !== field)
            .filter(field => undefined !== input[field])
            .forEach(field => {
                const value = input[field];
                if (Ux.isObject(value)) {
                    this.nodes.push(new QBranch(value));
                } else {
                    this.nodes.push(new QValue(field, value));
                }
            })
    }


    leaf = () => false;
    valid = () => this.isValid;

    sql() {
        const sql = [];
        this.nodes.forEach(node => {
            if (node.leaf()) {
                sql.push(node.sql());
            } else {
                sql.push("(" + node.sql() + ")");
            }
        })
        if (this._isAnd) {
            return sql.join(" AND ");
        } else {
            return sql.join(" OR ");
        }
    }
}

class Qr {
    private readonly seed: QNode;

    constructor(input: any) {
        this.seed = new QBranch(input);
    }

    sql = () => this.seed.sql();
}

export default Qr;