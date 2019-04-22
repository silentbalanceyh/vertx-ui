import Ai from "../ai/AI";

const columnRender = (column, reference, ops) => {
    if (column.hasOwnProperty("$render")) {
        const fnRender = Ai.aiCellRenders[column["$render"]];
        if (fnRender) {
            column.render = fnRender(reference, column, ops);
        }
    }
};
const columnFixed = (column = {}, $op = {}) => {
    // 设置column的默认宽度，解决 fixed 列的覆盖问题
    if (column.hasOwnProperty('fixed')
        && $op.contains(column['$render'])
        && !column.hasOwnProperty('width')) {
        /**
         * 默认两个链接
         * 60一个链接
         */
        column.width = 120;
    }
};
export default {
    columnRender,
    columnFixed
};