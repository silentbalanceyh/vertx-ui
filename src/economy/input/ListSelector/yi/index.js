import yiTable from './I.fn.table';
import yiClick from './I.fn.click';
import Ix from "../../../_internal/ix";

const yiDefault = (reference = {}) => {
    const {config = {}} = reference.props;

    /*
     * 各部分组件配置处理
     */
    const dialog = Ix.dialogConfig(reference, config);
    const search = Ix.searchConfig(reference, config);

    const onClick = yiClick(reference, config);
    // 通用表格方法
    const table = yiTable(reference, config);
    const attrs = {
        onClick, dialog, $ready: true,
        table, search
    };
    return {
        ...attrs,
        $visible: false,
        $loading: false,
        $data: [],
        $keySet: undefined,
    };
};

export default {
    yiDefault,
}