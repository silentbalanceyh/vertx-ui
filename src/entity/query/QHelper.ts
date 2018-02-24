import QConstant from "./QConstant";
const {
    EQ,
    NEQ,
    LT,
    LE,
    GT,
    GE,
    STR,
    END,
    ANY,
    NIL,
    NNL,
    IN,
    NIN
} = QConstant.In;

const Mode: any = QConstant.Mode;
const _transferOp = (field: string, op: string, value: any) => {
    const javaOp: any = QConstant.Out;
    const result: any = {};
    result.field = field.split(op)[0];
    result.value = value;
    const targetOp = javaOp[op];
    if ("LIKE" === targetOp) {
        result.mode = Mode[op];
    }
    result.op = targetOp;
    return result;
};
const _parseField = (field: string): Array<any> => {
    const ret: Array<any> = [];
    const ops = [NEQ, LE, LT, GE, GT, STR, END, ANY, NIL, NNL, IN];
    ops.forEach(op => {
        if (field.endsWith(op)) {
            const index: number = field.indexOf(op);
            const key = field.substring(0, index);
            const value = field.substring(index, field.length);
            ret.push(key);
            ret.push(value);
        }
        // 长度处理
        if (0 < ret.length) {
            return;
        }
    });
    if (0 == ret.length) {
        ret.push(field);
        ret.push(EQ);
    }
    return ret;
};
const fnParseField = (field: string, value: any): Object => {
    // 解析操作符
    const fieldOp = _parseField(field);
    const inputField = fieldOp[0];
    const op = fieldOp[1];
    return _transferOp(inputField, op, value);
};

export default {
    fnParseField
};
