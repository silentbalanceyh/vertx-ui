import Expr from "./O.format";
import Ele from "../element";

const valueExpr = (field = "", data = {}, keep = false) => {
    let display = "";
    if (0 <= field.indexOf(":")) {
        display = Expr.formatExpr(field, data, keep);
    } else {
        display = data[field];
        if (!display) display = "";
    }
    return display;
};
const valueFind = (target = {}, attrPath = []) => {
    if (2 <= attrPath.length) {
        const targetKey = attrPath[0];
        const name = attrPath[1];
        if (targetKey && name) {
            return Ele.ambiguityFind(target, `$${targetKey}`, attrPath[1]);
        } else {
            console.error(`[ Ux ] 解析的配置不对，key = $${targetKey}, name = ${name}`);
        }
    } else {
        if (1 === attrPath.length) {
            /*
             * 长度为1，直接提取
             */
            const targetKey = attrPath[0];
            return target[targetKey];
        } else {
            console.error(`[ Ux ] 解析表达式有问题，请检查：$${target}`);
        }
    }
};
export default {
    valueExpr,
    valueFind
}