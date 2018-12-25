import Rdr from '../UI.Render';
import Init from './Op.Init';

const calcTable = (reference, table) => {
    // 驱动最大的level
    const counterContainer = {};
    const {operations = {}} = reference.state;
    // 是否启用编辑模式
    const options = Init.readOptions(reference);
    const isEdit = options["table.edit.enabled"];
    table.columns.forEach(column => {
        // 包含列的渲染处理
        column.render = (text, record) => {
            const currentRowSpan = record[`${column.level}._counter`];
            const rowKey = record[`${column.level}.key`];
            const checkKey = `${column.dataIndex}-${rowKey}`;
            if (counterContainer[checkKey]) {
                // 解决空行问题
                return text ? {
                    children: text,
                    props: {
                        rowSpan: 0
                    }
                } : {
                    children: text,
                    props: {
                        rowSpan: 1
                    }
                };
            } else {
                counterContainer[checkKey] = true;
                let rowSpan = 0 === currentRowSpan ? 1 : currentRowSpan;
                // 修正不渲染的问题
                if (undefined === rowSpan) {
                    rowSpan = 1;
                }
                return (isEdit) ? Rdr.renderOp(reference, record, {
                    text, rowSpan, column
                }) : {
                    children: text,
                    props: {
                        rowSpan
                    }
                };
            }
        };
        // 另外一个维度的处理
        const render = operations[column.dataIndex];
        if (isEdit && render && render.hasOwnProperty("title")) {
            column.title = Rdr.renderTitle(reference, column, render.title);
        }
        // 禁用排序尝试，对于TreeTable必须禁用
        if (!column.hasOwnProperty('sorter')) {
            column.sortOrder = false;
        }
    });
    // 构造数据
    return table;
};
export default {
    calcTable
}