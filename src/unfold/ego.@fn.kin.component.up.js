import Evt from './ego.fn.kin.event';
import __Zn from './zero.module.dependency';
import Ux from 'ux';

/**
 * ## 「标准」`Ex.kinUp`
 *
 * @method kinUp
 * @memberOf module:kin/unfold
 * @param reference
 * @param previous
 * @return {*}
 */
export default (reference, previous = {}) => {
    const {
        $loading = true,        // 只加载数据
        $ready = false,
        $paging = false,
    } = reference.state;

    const prevProps = previous.prevProps;
    const props = reference.props;
    // $ready = true 证明配置加载完成了
    const dataLog = {
        $ready,
        $loading
    };
    if ($ready) {
        const upPre = prevProps.$forceUpdate;
        const upNow = props.$forceUpdate;
        if (upPre !== upNow) {
            Ux.dgDebug(dataLog, "[ ExComplexList ] 强制更新", "#ca3d3e");
            Ux.of(reference).paging().done();             // $ready = false
            return;         // 中断
        }

        // 动态路由（路由变化时的流程）
        if (Ux.isLoaded(props, prevProps)) {
            // 配置检查结果
            const diffAtom = __Zn.upList(props, prevProps);
            if (diffAtom) {
                Ux.dgDebug(diffAtom, "[ ExComplexList ] 配置变化", "#ca3d3e");
                Ux.of(reference).paging().done();         // $ready = false
                return;
            }
        }


        // $loading = true 证明需要加载
        if ($loading) {
            Ux.dgDebug(dataLog, "[ ExComplexList ] 重新加载数据", "#ca3d3e");
            const state = reference.state;
            Evt.kinDoSearch(reference, state).then(updated => {
                Ux.of(reference).in(updated).load().handle(() => {
                    Ux.dglList(reference);
                })
            })
        }
    }
    if ($paging) {
        const {pageFn} = previous;
        if (Ux.isFunction(pageFn)) {
            Ux.dgDebug(dataLog, "[ ExComplexList ] 重新加载全部", "#ca3d3e");
            pageFn(reference).then(state =>
                Ux.of(reference).paged().in(state)
                    .ready().loading(false).done())
        } else {
            throw new Error("[ ExComplexList ] 动态执行核心函数丢失！！")
        }
    }
}