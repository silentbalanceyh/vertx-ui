import Ux from "ux";
import Act from "./Op.Action";
import Init from './Op.Init';

const _initTablePager = (reference = {}) => {
    const data = Init.initData(reference);
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true
    };
    pagination.total = data.count;
    const config = Init.initConfig(reference);
    const query = Ux.irGrid(config.query, reference.props);
    const pager = query.pager ? query.pager : {size: 10, page: 1};
    pagination.pageSize = pager.size ? pager.size : 10;
    pagination.current = pager.page ? pager.page : 1;
    return pagination;
};

const _initChange = (reference = {}) => (pagination, filter, sorter) => {
    console.info(pagination, filter, sorter);
};

const initTable = (reference = {}) => {
    const config = Init.initConfig(reference);
    const table = config.table;
    // 列渲染
    const props = reference.props;
    const op = {
        rxEdit: Act.rxEdit,
        rxDelete: Act.rxDelete,
    };
    Ux.uiTableColumn({
        props: {
            ...props,
            ...op,
            $self: reference
        },
    }, table.columns);
    // 分页处理
    table.pagination = _initTablePager(reference);
    table.onChange = _initChange(reference);
    const data = Init.initData(reference).list;
    return {table, data};
};
export default {
    initTable
}