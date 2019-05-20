import Ux from 'ux';
import U from 'underscore';
import Action from './Fx.Action';

const onPager = (reference = {}) => {
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
    };

    return pagination;
};
const initColumns = (reference, table = {}) => {
    const props = reference.props;
    const op = {
        rxEdit: Action.rxEdit,
        rxDelete: Action.rxDelete
    };
    return Ux.uiTableColumn({
        props: {
            // 当前引用对应的props属性
            ...props,
            // 专用的rxEdit/rxDelete的Api调用专用数据
            ...op,
            // 当前组件引用
            $self: reference
        },
    }, table.columns);
};
const init = (reference, options = {}, table = {}) => {
    table = Ux.clone(table);
    // 扩展行外置处理
    const {rxExpandRow} = reference.props;
    if (U.isFunction(rxExpandRow)) {
        table.expandedRowRender = rxExpandRow;
    }
    // 静态行处理
    if (!options['column.dynamic']) {
        table.columns = initColumns(reference, table);
    }
    return table;
};
const render = (reference) => {
    const {table = {}, data = {}, loading = true, options = {}} = reference.state;
    const $table = Ux.clone(table);
    $table.loading = loading;
    $table.dataSource = data.list ? data.list : [];
    // 动态列处理
    if (options['column.dynamic']) {
        table.columns = initColumns(reference, table);
    }
    // 分页处理
    table.pagination = onPager(reference);
    // onChange事件
    table.onChange = Action.rxChange(reference);
    return $table;
};

export default {
    init,
    render,
};