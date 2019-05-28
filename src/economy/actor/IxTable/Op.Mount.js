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

const mountPointer = (ref) => {
    const reference = Ux.onReference(ref, 1);
    reference.setState({
        // 加载函数
        fnLoading: ($loading) => ref.setState({$loading}),
        // 刷新函数
        fnRefresh: () => Fx.rxRefresh(ref),
        // 读取 mocker 引用
        fnMock: () => ref.state ? ref.state.$mocker : null,
        // 修改 $condition 的条件函数，同时清空 $keyword
        fnCondition: ($condition = {}) => {
            // 清空查询条件
            const $original = ref.state.$condition;
            _clearFilter(ref, $original);
            // 更改状态
            const $keyword = _getKeyword(reference, $original);
            ref.setState({
                $condition,
                $keyword,
                $loading: true,
            });
        }
    });
};

export default {
    mountPointer
};