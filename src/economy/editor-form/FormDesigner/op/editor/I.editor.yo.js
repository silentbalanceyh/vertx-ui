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
        // 行对应元数据
        rowConfig = Ux.clone(rowConfig);
        rowConfig.rowIndex = index;
        rowConfig.key = row.key;
        return {
            config: rowConfig,
            data: {},   // 后期要使用
            key: row.key
        };
    },
    yoCell: (reference, cell, config = {}) => {
        /*
         * 占用行计算
         */
        const {$cells = []} = reference.state;
        const spans = $cells.map(cell => cell.span)
            .reduce((left, right) => left + right, 0);
        const $status = {};
        $status.used = spans;
        $status.cells = $cells.length;
        return {
            config: {
                ...cell,
                ...config,
            }, key: cell.key, $status
        };
    }
}