// 导入外层
import Ele from "../../element";

const findValue = (target = {}, attrPath = []) => {
    // E.fxTerminal(2 !== attrPath.length, 10035, target);
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
        //
    }
};
const fnPredicate = (type, expression, supplier) => {
    if (expression && "string" === typeof expression) {
        return supplier();
    } else {
        console.error(` [ Ux ] ${type} 解析出错！expression = `, expression);
    }
};
export default {
    findValue,
    fnPredicate,
}