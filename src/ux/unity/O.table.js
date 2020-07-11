import Abs from '../abyss';
import Ele from "../element";

/**
 * ## 标准函数
 *
 * 1. fnRender 为特殊函数（原始的 render，去除 $render 配置后）
 * 2. column 为列配置
 *
 * 列配置的数据结构如：
 *
 * ```json
 * {
 *      "field": "_children"
 * }
 * ```
 *
 * @memberOf module:_table
 * @param {Object} column 输入列配置相关信息
 * @param {any|Function} fnRender 原始函数信息
 */
const cellWrapper = (column = {}, fnRender) => {
    return (text, record = {}, index) => {
        const {key} = record;
        const jsx = {};
        jsx.children = Abs.isFunction(fnRender) ?
            fnRender(text, record, index) : text;
        jsx.props = {};
        const {$config = {}} = column;
        const {rowSpan} = $config;
        if ("number" === typeof rowSpan) {
            /*
             * 静态处理，直接使用数字
             */
            jsx.props.rowSpan = rowSpan;
        } else {
            const source = record[rowSpan];
            /*
             * 使用非数字
             */
            const foundIndex = Ele.elementIndex(source, key, 'key');
            if (0 === foundIndex) {
                jsx.props.rowSpan = source.length;
            } else {
                jsx.props.rowSpan = 0;
            }
        }
        return jsx;
    }
}
export default {
    cellWrapper
}