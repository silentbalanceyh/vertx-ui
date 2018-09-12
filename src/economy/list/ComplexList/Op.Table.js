import Ux from "ux";
import Act from "./Op.Action";
import Init from './Op.Init';
import U from "underscore";
import Fn from '../../_internal/Ix.Fn';

const {Mock} = Fn;

const _initTablePager = (reference = {}) => {
    const data = initData(reference);
    const pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
    };
    pagination.total = data.count;
    const {$query} = reference.props;
    if ($query.is()) {
        const query = $query.to();
        const pager = query.pager ? query.pager : {size: 10, page: 1};
        pagination.pageSize = pager.size ? pager.size : 10;
        pagination.current = pager.page ? pager.page : 1;
        return pagination;
    }
};

const _initChange = (reference = {}) => (pagination, filter, sorter) => {
    // 变更之前如果是Mock环境则需要清掉Mock中的ready
    const {mock, mocker} = reference.state;
    if (mock && mocker) {
        // 将Mocker清空，只是在Mock环境下保留Loading效果而已
        reference.setState({mocker: undefined});
    }
    // 分页
    const query = Init.readQuery(reference);
    query.pager.page = pagination.current;
    query.pager.size = pagination.pageSize;
    // 排序
    if (sorter.field) {
        const field = sorter.field;
        const desc = "descend" === sorter.order ? "DESC" : "ASC";
        query.sorter = [`${field},${desc}`];
    }

    Ux.writeTree(reference, {
        "grid.list": undefined,
        "grid.query": query
    });
};

const initData = (reference) => {
    const {$list} = reference.props;
    if ($list) {
        const ready = $list.is();
        const data = $list.is() ? $list.to() : {};
        if (U.isArray(data.list)) {
            return {ready, ...data};
        } else {
            return {list: [], count: 0, ready};
        }
    } else {
        return {list: [], count: 0, ready: false};
    }
};
const initTable = (reference = {}) => {
    const table = Init.readTable(reference);
    // 列渲染
    const props = reference.props;
    const op = {
        rxEdit: Act.rxEdit,
        rxDelete: Act.rxDelete,
    };
    table.columns = Ux.uiTableColumn({
        props: {
            // 当前引用对应的props属性
            ...props,
            // 专用的rxEdit/rxDelete的Api调用专用数据
            ...op,
            // 当前组件引用
            $self: reference
        },
    }, table.columns);
    // 分页处理，客户端模式
    table.pagination = _initTablePager(reference);
    table.onChange = _initChange(reference);
    let data = initData(reference);
    data = Mock.mockConnect(reference, data);
    // 设置ready单独
    const {$list} = reference.props;
    data.ready = $list && $list.is();
    // Mock链接处理
    return {table, data: data.list, ready: data.ready};
};
export default {
    initTable
}