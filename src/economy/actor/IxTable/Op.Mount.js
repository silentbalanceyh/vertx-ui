import Ux from "ux";
import Fx from "../Fx";

const mountPointer = (ref) => {
    const reference = Ux.onReference(ref, 1);
    reference.setState({
        // 加载函数
        fnLoading: ($loading) => ref.setState({$loading}),
        // 刷新函数
        fnRefresh: () => Fx.rxRefresh(ref),
        // 读取 mocker 引用
        fnMock: () => ref.state ? ref.state.$mocker : null,
        // 设置 $condition 专用
        fnCondition: ($condition = {}) => ref.setState({
            $condition, $keyword: {}, $loading: true
        })
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