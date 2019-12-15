import yiDialog from './I.fn.dialog';
import yiTable from './I.fn.table';
import yiSearch from './I.fn.search';
import yiClick from './I.fn.click';

const yiDefault = (reference = {}) => {
    const {config = {}} = reference.props;
    // 核心配置处理
    const onClick = yiClick(reference, config);
    const dialog = yiDialog(reference, config);
    // 通用表格方法
    const table = yiTable(reference, config);
    const search = yiSearch(reference, config);
    const attrs = {
        onClick, dialog, $ready: true,
        table, search
    };
    return {
        ...attrs,
        $visible: false,
        $loading: false,
        $data: [],
        $select: undefined,
    };
};

export default {
    yiDefault,
}