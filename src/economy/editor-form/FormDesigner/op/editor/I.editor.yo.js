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
        // 表单配置传入
        return {
            reference,          /* 顶层引用 */
            config: rowConfig,
            data: row.data,     // 后期要使用
            key: row.key,
            $raft: data,        // 表单配置
        };
    },
    yoCell: (reference, cell, config = {}) => {
        /*
         * 占用行计算
         */
        const {data = []} = reference.props;
        const spans = Cmn.cellSpans(data);
        const $status = {};
        $status.used = spans;
        $status.cells = data.length;
        /* 单元格交换函数 */
        const {raft = {}, render, ...rest} = cell;
        return {
            config: {
                rowKey: config.key,
                ...config,
                ...rest,
            },
            data: {
                raft,
                render,
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