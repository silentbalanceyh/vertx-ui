import Rdr from './UI.Render'

const calcTable = (reference, table) => {
    // 驱动最大的level
    const counterContainer = {};
    const {operations = {}} = reference.state;
    table.columns.forEach(column => {
        // 包含列的渲染处理
        column.render = (text, record) => {
            const rowSpan = record[`${column.level}._counter`];
            const rowKey = record[`${column.level}.key`];
            const checkKey = `${column.dataIndex}-${rowKey}`;
            if (counterContainer[checkKey]) {
                return {
                    children: text,
                    props: {
                        rowSpan: 0
                    }
                }
            } else {
                counterContainer[checkKey] = true;
                return Rdr.renderOp(reference, record, {
                    text, rowSpan: 0 === rowSpan ? 1 : rowSpan, column
                })
            }
        };
        // 另外一个维度的处理
        const render = operations[column.dataIndex];
        if (render && render.hasOwnProperty("title")) {
            column.title = Rdr.renderTitle(column, render.title);
        }
    });
    // 构造数据
    return table;
};
export default {
    calcTable
}