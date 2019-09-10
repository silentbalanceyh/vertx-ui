// 导入外层
import E from "../../error";
import Ele from "../../element";

const findValue = (target = {}, attrPath = []) => {
    E.fxTerminal(2 !== attrPath.length, 10035, target);
    if (2 === attrPath.length) {
        const targetKey = attrPath[0];
        const name = attrPath[1];
        if (targetKey && name) {
            return Ele.ambiguityFind(target, `$${targetKey}`, attrPath[1]);
        } else {
            console.error(`[ Ux ] 解析的配置不对，key = $${targetKey}, name = ${name}`);
        }
    } else {
        console.error(`[ Ux ] 解析表达式有问题，请检查：$${target}`);
    }
};
export default {
    findValue,
}