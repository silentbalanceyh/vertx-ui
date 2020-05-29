import Ux from "ux";

export default {

    yoRow: (reference, row, index) => {
        /* 处理 columns 列信息 */
        const {data = {}} = reference.props;
        let rowConfig = {};
        {
            // 列类型
            if (!data.columns) data.columns = 3;
            rowConfig.grid = data.columns;
        }
        const key = `key-row-${index}`;
        // 行对应元数据
        rowConfig = Ux.clone(rowConfig);
        rowConfig.rowIndex = index;
        return {config: rowConfig, data: row, key};
    },
    yoCell: (reference, cell, config = {}) => {
        const {rowIndex, cellIndex} = cell;
        const key = `key-cell-${rowIndex}-${cellIndex}`;
        return {config: cell, key};
    }
}