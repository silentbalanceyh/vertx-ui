import Ux from 'ux';

const cellGrid = (cell = {}, matrix = {}) => {
    if (cell.optionItem) {
        const updatedItem = Ux.clone(cell.optionItem);
        if (updatedItem.wrapperCol) delete updatedItem.wrapperCol;
        if (updatedItem.labelCol) delete updatedItem.labelCol;
        if (updatedItem.style) delete updatedItem.style;
        cell.optionItem = updatedItem;
    }
    Ux.aiLayout(cell, matrix);
}
const _parseLen = (data = [], readyData = {}) => {
    const $data = data.filter(item => item.key === readyData.key);
    if (0 < $data.length) {
        return data.length;
    } else {
        return data.length + 1;
    }
}
const _parseField = (cellData = {}, matrix = {}, formRef = {}) => {
    /*
     * 构造新的 item
     */
    let $cell;
    /*
     * 基础解析
     */
    {
        $cell = Ux.aiExprTitle(cellData);
        $cell = Ux.aiExprField($cell);
        $cell = Ux.aiExprFieldEx($cell);
    }
    if (!$cell.render) {
        /*
         * render 流程
         */
        $cell.render = "aiInput";
    }
    if (!$cell.hasOwnProperty("span")) {
        const {columns} = formRef;
        if (columns) {
            $cell.span = 24 / columns;
        }
    }
    return $cell;
}
/*
 * 二义性函数，处理单元格
 * 1）reference, cellData
 * 2）formRef, cellData, matrix
 * 判断依据在于第三参数
 */
export default {
    cellGrid,
    cellConfig: (reference, cellData = {}, matrix) => {
        matrix = Ux.clone(matrix);
        /*
         * 先执行 cellData 的标准化
         */
        let cell = {};
        if ("string" === typeof cellData) {
            cell = _parseField(cellData, matrix, reference);
        } else {
            if (cellData.metadata) {
                cell = _parseField(cellData, matrix, reference);
            }
        }
        /*
         * 计算当前的 matrix 详细数据
         * rowKey,
         * rowIndex,
         * cellIndex,
         * columns,
         * length,
         */
        if (matrix) {
            /*
             * 配置初始化流程
             */
            cellGrid(cell, {
                ...matrix,
                columns: matrix.length,
            })

            if (!matrix.hasOwnProperty('span')) {
                if (cell.span) {
                    matrix.span = cell.span;
                }
            }
            /*
             * 处理单元格
             */
            const readyData = Ux.clone(matrix);
            readyData.raft = cell;
            readyData.render = cell.render;
            readyData.span = cell.span;
            return readyData;
        } else {
            const readyData = Ux.clone(cellData);
            if (readyData.raft) {
                const {render} = cellData;
                if (render) {
                    /* 有组件的变动，修改布局 */
                    const {raft, ...rest} = cellData;
                    cell = Ux.clone(raft);
                    if (cellData.span !== cell.span) {
                        cell.span = cellData.span;
                    }

                    cellGrid(cell, {
                        ...rest,
                        columns: rest.length
                    })
                    readyData.raft = cell;
                    readyData.render = render;
                }
                return readyData;
            } else {
                /* 添加 */
                const {data, render, ...rest} = cellData;
                cell = _parseField(data, rest);
                if (render && cell.render !== render) {
                    cell.render = render;
                }
                if (render) {
                    const {data = []} = reference.props;
                    const length = _parseLen(data, cellData)

                    cellGrid(cell, {
                        ...rest,
                        length,         // 新添加的时候需要计算 length
                        columns: length,
                    })

                    readyData.raft = cell;
                    if (cellData.span) {
                        readyData.span = cellData.span;
                    }
                    readyData.render = cell.render;
                }
                return readyData;
            }
        }
    }
}