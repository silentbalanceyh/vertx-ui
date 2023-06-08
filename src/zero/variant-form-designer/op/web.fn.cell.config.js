import __Zn from '../zero.uca.dependency';

const cellGrid = (cell = {}, matrix = {}) => {
    if (cell.optionItem) {
        const updatedItem = __Zn.clone(cell.optionItem);
        if (updatedItem.wrapperCol) delete updatedItem.wrapperCol;
        if (updatedItem.labelCol) delete updatedItem.labelCol;
        if (updatedItem.style) delete updatedItem.style;
        cell.optionItem = updatedItem;
    }
    __Zn.aiLayout(cell, matrix);
    /* 特殊处理 */
    if ("aiAction" === cell.render) {
        cell.optionItem.label = " ";
    }
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
    $cell = __Zn.aiExprTitle(cellData);
    $cell = __Zn.aiExprField($cell);
    $cell = __Zn.aiExprFieldEx($cell);
    if (!$cell.hasOwnProperty("span")) {
        const {columns} = formRef;
        if (columns) {
            $cell.span = 24 / columns;
        }
    }
    return $cell;
}

const _parseRender = (cell = {}) => {
    /* 其他所有的信息都是完整的，仅非 input 类型必定带 render */
    if (!cell.render) {
        /*
         * 有三种
         * 1. 默认的 aiInput
         * 2. $button 是专用的 button 类型
         * 3. title 字段的特殊处理
         */
        if (cell.title) {
            cell.render = "aiTitle";
            cell.span = 24;
        } else if ("$button" === cell.field) {
            cell.render = "aiAction";
        } else {
            cell.render = "aiInput";
        }
    }
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
        matrix = __Zn.clone(matrix);
        /*
         * 先执行 cellData 的标准化
         */
        let cell = {};
        if ("string" === typeof cellData) {
            cell = _parseField(cellData, matrix, reference);
        } else if (cellData.metadata) {
            cell = _parseField(cellData, matrix, reference);
        } else {
            cell = __Zn.clone(cellData);
        }
        /*
         * 执行解析
         */
        _parseRender(cell);
        /*
         * 计算当前的 matrix 详细数据
         * rowKey,
         * rowIndex,
         * cellIndex,
         * columns,
         * length,
         */
        let normalizedResult;
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
            const readyData = __Zn.clone(matrix);

            readyData.raft = cell;
            readyData.render = cell.render;
            readyData.span = cell.span;
            normalizedResult = readyData;
        } else {
            const readyData = __Zn.clone(cellData);
            if (readyData.raft) {
                const {render} = cellData;
                if (render) {
                    /* 有组件的变动，修改布局 */
                    const {raft, ...rest} = cellData;
                    cell = __Zn.clone(raft);
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
                normalizedResult = readyData;
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
                normalizedResult = readyData;
            }
        }
        return normalizedResult;
    }
}