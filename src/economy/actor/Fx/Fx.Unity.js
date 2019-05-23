import Ux from 'ux';
import U from 'underscore';
import CRUD from './Fx.Unity.CRUD';

const write = (ref, react = {}, redux = {}) => {
    if (redux) {
        Ux.writeTree(ref, redux);
    }
    const reactState = {};
    reactState.ready = true;
    if (react) {
        Object.assign(reactState, react);
    }
    ref.setState(reactState);
};
const consume = (reference, name) => consumer => {
    if (reference) {
        const fun = reference.props[name];
        if (U.isFunction(fun)) {
            if (U.isFunction(consumer)) {
                return consumer(fun);
            } else {
                throw new Error("[Ex] 未传入consumer")
            }
        } else {
            throw new Error(`[Ex] ${name} 函数出错！`);
        }
    } else {
        throw new Error("[Ex] 空 reference 处理。");
    }
};


const doLoading = (reference, loading = true) =>
    consume(reference, 'fnLoading')(fnLoading => fnLoading(loading));
const doSubmit = (reference, submitting = true) =>
    consume(reference, 'fnSubmit')(fnSubmit => fnSubmit(submitting));
const doRefresh = (reference) =>
    consume(reference, "fnRefresh")(fnRefresh => fnRefresh());
const doClose = (reference) =>
    consume(reference, 'fnClose')(fnClose => fnClose());
const doMocker = (reference) =>
    consume(reference, "fnMock")(fnMock => fnMock());

const submit = (reference, executor) => {
    reference.setState({$loading: true});
    Ux.toLoading(executor);
};
const change = (reference, executor, {
    pagination, filters, sorter
}) => {
    reference.setState({
        $loading: true,
        // 专用 $condition，用于列定义，这里不更新 $condition， 会导致问题
        $condition: filters,
        // FIX：带有 filters 的列同时使用排序和过滤时的排序不生效的问题
        $sorter: sorter
    });
    Ux.dgDebug({
        pagination,
        filters,
        sorter
    }, "[Ex] 改变条件专用事件");
    Ux.toLoading(executor);
};
export default {
    write,
    consume,
    submit, // 提交专用
    change, // 表格专用

    doMocker,   // 模拟数据
    doLoading,  // 开始加载数据
    doClose,    // 关闭窗口
    doRefresh,  // 重新加载页面
    doSubmit,   // 提交开始

    ...CRUD,
}