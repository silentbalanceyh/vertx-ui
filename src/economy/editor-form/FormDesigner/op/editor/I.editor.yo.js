import Ux from "ux";
import Cmn from '../library';

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
            reference,      /* 顶层引用 */
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
        const spans = Cmn.cellSpans($cells);
        const $status = {};
        $status.used = spans;
        $status.cells = $cells.length;
        /* 单元格交换函数 */
        const {rxCellWrap} = reference.props;
        return {
            rxCellWrap, /* 继承的单元格交换函数 */
            config: {
                ...config,
                ...cell,
            }, key: cell.key, $status
        };
    },
    yoExtra: (reference) => {
        const {$cells = []} = reference.state;
        const spans = Cmn.cellSpans($cells);
        if (24 === spans) {
            return {commandStyle: {display: "none"}, className: "e-command"};
        } else {
            return {commandStyle: {display: "inline-block"}, className: "e-command"};
        }
    }
}