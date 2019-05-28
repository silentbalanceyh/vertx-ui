import Ux from "ux";
import Fx from "../Fx";

const _clearFilter = (reference, $condition = {}) => {
    const {$table: {columns = []}} = reference.state;
    const fields = columns.filter(column => column.hasOwnProperty("$filter"))
        .map(column => column.dataIndex);
    const $fields = Ux.immutable(fields);
    const keys = Object.keys($condition);
    keys.filter(key => $fields.contains(key))
        .map(key => `btn-clear-${key}`)
        .forEach(buttonId => Ux.connectId(buttonId));
};

const _getKeyword = (reference, $condition = {}) => {
    const {$keyword = {}} = reference.state;
    const keys = Object.keys($condition);
    keys.filter(key => $keyword.hasOwnProperty(key))
        .forEach(key => delete $keyword[key]);
    return Ux.clone($keyword);
};

const _getCond = (reference) => {
    const {$condition = {}} = reference.state;
    return {
        // 读取条件信息, IxTable 中的 $condition
        getCond: () => $condition,
        // 设置条件信息
        setCond: ($condition) => reference.setState({$condition}),
        // 是否有条件
        isCond: () => 0 < Object.keys($condition).length,
    };
};

const mountPointer = (ref) => {
    const reference = Ux.onReference(ref, 1);
    reference.setState({
        // 加载函数
        fnLoading: ($loading) => ref.setState({$loading}),
        // 刷新函数
        fnRefresh: () => Fx.rxRefresh(ref),
        // 读取 mocker 引用
        fnMock: () => ref.state ? ref.state.$mocker : null
    });
};
const mountCond = (ref) => {
    const reference = Ux.onReference(ref, 1);
    const {$condition = {}} = ref.state;
    reference.setState({$cond: $condition});
};
export default {
    mountPointer,
    mountCond,
};