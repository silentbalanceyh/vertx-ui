import Cmn from '../library';
import Ux from 'ux';

const toStatus = (reference) => {
    const {data = []} = reference.props;
    const spans = Cmn.cellSpans(data);
    const $status = {};
    $status.used = spans;
    $status.cells = data.length;
    return $status;
}

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
        const {rxApi, rxModelSave, $palette = {}} = reference.props;
        return {
            ...Ux.onUniform(reference.props),
            reference,          /* 顶层引用 */
            config: rowConfig,
            data: row.data,     // 后期要使用
            key: row.key,
            $form: data,        // 表单配置
            $palette,           // 类型信息
            rxApi,              // Api 读取器
            rxModelSave,        // 模型更新
        };
    },
    yoCell: (reference, cell, config = {}) => {
        /* 状态计算 */
        const $status = toStatus(reference);
        /* 单元格交换函数 */
        const {raft = {}, render, ...rest} = cell;

        const {rxApi, rxModelSave, $palette = {}} = reference.props;
        return {
            ...Ux.onUniform(reference.props),
            config: {
                rowKey: config.key,
                ...config,
                ...rest,
                render,             // 带上 render 用于配置处理
            },
            data: {
                ...raft,
                render,
            },
            key: cell.key,
            $status,
            $palette,
            rxApi,
            rxModelSave,
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