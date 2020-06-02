import Cmn from '../library';

export default {

    yoRow: (reference, row, index) => {
        // 行对应元数据
        const rowConfig = {};
        rowConfig.rowIndex = index;
        rowConfig.key = row.key;
        const {data = {}} = reference.props;
        rowConfig.span = 24 / data.columns;     // 计算列宽度
        rowConfig.columns = data.columns;          // 网格数据
        return {
            reference,          /* 顶层引用 */
            config: rowConfig,
            data: row.data,     // 后期要使用
            key: row.key
        };
    },
    yoCell: (reference, cell, config = {}) => {
        /*
         * 占用行计算
         */
        const {data = [], rxCellWrap} = reference.props;
        const spans = Cmn.cellSpans(data);
        const $status = {};
        $status.used = spans;
        $status.cells = data.length;
        /* 单元格交换函数 */
        return {
            rxCellWrap, /* 继承的单元格交换函数 */
            config: {
                rowKey: config.key,
                ...config,
                ...cell,
            },
            key: cell.key,
            $status
        };
    },
    yoExtra: (reference) => {
        const {data = []} = reference.props;
        const spans = Cmn.cellSpans(data);
        if (24 === spans) {
            return {
                commandStyle: {display: "none"},
                className: "e-command",
                placement: "left",
            };
        } else {
            return {
                commandStyle: {display: "inline-block"},
                className: "e-command",
                placement: "left"
            };
        }
    }
}