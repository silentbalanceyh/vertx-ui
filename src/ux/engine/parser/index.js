// 导入当前目录
import parseValue from './I.fn.value';
// 导入外层
import Dev from '../../develop';
/*
 * 字段解析
 */
const parseField = (input) => {
    let op = "=";
    let field;
    if (0 < input.indexOf(',')) {
        /*
         * 带符号
         */
        const parsed = input.replace(/ /g, '').split(',');
        field = parsed[0];
        op = parsed[1];
        if (!op) op = "=";   // 默认是等号
    } else {
        /*
         * 不带符号
         */
        field = input;
    }
    return {op, field};
};
const parseInput = (input = {}, {props, state}) => {
    // 查找根节点
    const parsed = {};
    Object.keys(input)
        .filter(field => undefined !== input[field])
        .forEach(field => {
            const value = parseValue(input[field], {state, props});
            if (undefined !== value) {        // value 不为 undefined 就处理
                parsed[field] = value;
            }
        });
    Dev.dgDebug(parsed, "[ Ux ] 参数分析最终结果：", "black");
    return parsed;
};
export default {
    parseField,
    parseValue,
    parseInput,
}