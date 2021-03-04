// -------------- 更新专用方法 -----------------
import Ux from "ux";
import Fn from "../functions";
import Yi from "./yi";

const updateInternal = (reference, prevState, consumer) => {
    /*
     * 先检查 props 中的 $query 变化
     */
    const state = Ux.clone(reference.state);
    const current = state['$dirty'];
    const original = prevState['$dirty'];
    /*
     * 防止 $loading 一旦改变就更新
     */
    if (original !== current) {
        if (current) {
            Ux.dgDebug({
                $dirty: current
            }, "[ ExU ] $dirty 标记出现，重新同步数据：Sync....");
            /*
             * 内置更新
             */
            if (state.$loading) {
                const {$query = {}} = Ux.clone(reference.state);
                Ux.toLoading(() => Fn.rx(reference).search($query)
                    .then($data => Yi.yiColumn(reference, reference.state, $data))
                    .then(done => consumer(done)))
            }
        }
    }
};

/**
 * ## 扩展函数
 *
 * 检查 $query 是否执行了变化，如果变化则重新加载。
 *
 * @memberOf module:_channel
 * @method yuQuery
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
 */
const yuQuery = (reference, virtualRef) => {
    /*
     * 先检查 props 中的 $query 变化
     */
    const prevProps = virtualRef.props;
    const props = reference.props;
    /*
     * 默认的 $query 改变
     */
    const $defaultChecked = Fn.upValue(props, prevProps, '$query');
    if ($defaultChecked) {
        /*
         * 外层组件引起内置组件的变更，修改默认的 query
         * 1）这种情况不执行请求发送
         * 2）直接更新：
         *    从：props -> $query
         *    到：state -> $query
         */
        const $query = $defaultChecked.current;
        /*
         * 分支1：
         * 1）props 中的 $query 变化引起 state 中的 $query 变化
         * 2）$loading = true
         * Q 为 4 态对象
         */
        Fn.rsLoading(reference)({$query});
    } else {
        /*
         * 状态变更
         */
        const prevState = virtualRef.state;
        const state = reference.state;
        /*
         * 检查状态中的 query
         */
        const checked = Fn.upQuery(state, prevState);
        if (checked) {
            const {current = {}} = checked;
            /*
             * 只有 $loading = true 的时候执行
             */
            if (state.$loading) {
                Ux.toLoading(() => Fn.rx(reference).search(current)
                    .then($data => Yi.yiColumn(reference, state, $data))
                    .then(state => {
                        const {$data, $lazy} = state;
                        /*
                         * 设置当前组件的加载
                         * ( ExTable )
                         */
                        Fn.rsLoading(reference, false)({$data, $lazy});
                    })
                );
            }
        } else {
            Ux.dgDebug(state.$query, "[ ExU ] $query 未改变，不刷新！", "#6E8B3D");
        }
    }
}
/**
 * ## 扩展函数
 *
 * 检查 $dirty 标记执行是否脏数据变化，如果变化则重新加载。
 *
 * @memberOf module:_channel
 * @method yuDirty
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
 */
const yuDirty = (reference, virtualRef) => {
    const {$dirty = false} = reference.props;
    const prevState = virtualRef.state;
    if ($dirty) {
        /*
         * 侦测到上层 Dirty（外置 Reload）
         * 将外部改成 $dirty = false
         */
        Fn.rx(reference).dirty(false);
        /*
         * 修改内部状态双变量
         * $dirty = true
         * $loading = true （效果）
         */
        Fn.rsLoading(reference)({$dirty: true});
    } else {
        updateInternal(reference, prevState, ((state = {}) => {
            const {$data, $lazy} = state;
            /*
             * 修改内部状态双变量
             * $dirty = false
             * $loading = false
             */
            Fn.rsLoading(reference, false)({$data, $lazy, $dirty: false});
        }));
    }
}
/**
 * ## 扩展函数
 *
 * 检查 $condition 是否执行了变化，如果变化则重新加载。
 *
 * @memberOf module:_channel
 * @method yuCondition
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
 */
const yuCondition = (reference, virtualRef) => {
    /*
     * 先检查 $condition 是否有变化
     */
    const prevProps = virtualRef.props;
    const props = reference.props;
    /*
     * 默认的 $condition
     */
    const $defaultCond = Fn.upCondition(props, prevProps);
    if ($defaultCond) {
        /*
         * 外层组件引起的变化
         */
        const $condition = $defaultCond.current;
        reference.setState({$condition});
    } else {
        const prevState = virtualRef.state;
        const state = reference.state;
        /*
         * 检查 $condition
         */
        const checked = Fn.upCondition(state, prevState);
        if (checked) {
            const {current = []} = checked;
            /*
             * 使用新的 $condition
             */
            Ux.dgDebug(checked, "[ ExU ] $condition 改变");
            /*
             * 读取 condition 专用配置，列变更时会使用的配置，直接从 state 中读取
             */
            Fn.rx(reference).condition(current);
        }
    }
}
/**
 * ## 扩展函数
 *
 * 直接执行纯的 $loading，检查当前属性 props 和 state 中的 loading 是否变化。
 *
 * 1. props 中的 $loading：外置传入
 * 2. state 中的 $loading：内置传入
 *
 * @memberOf module:_channel
 * @method yuLoading
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
 */
const yuLoading = (reference, virtualRef) => {
    /*
     * 直接检查 props / state 中的 $loading 是否一致
     */
    const props = reference.props;
    const state = Ux.clone(reference.state);
    const original = state.$loading;
    const current = props.$loading;
    if (current && !original) {
        Fn.rsLoading(reference, true)({});
    }
}
/**
 * ## 扩展函数
 *
 * 路由路径是否发生了变化。
 *
 * @memberOf module:_channel
 * @method yuRouter
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
 * @param {Function} callback 路由变化的回调函数
 */
const yuRouter = (reference, virtualRef, callback) => {
    if (Ux.isFunction(callback)) {
        /*
         * 当前和原始属性
         */
        const prevProps = virtualRef.props;
        const props = reference.props;
        /*
         * 检查 $router 中的数据（特殊点在于 $router 不是 Object类型）
         */
        const $prevRouter = prevProps.$router;
        const $router = props.$router;
        /*
         * 变化 params 时属于 $router 中的变化
         */
        const current = $router.params();
        const original = $prevRouter.params();
        if (Ux.isDiff(current, original)) {
            /*
             * 执行 callback
             */
            callback();
        }
    } else {
        throw new Error("[ ExR ] 请传入 callback 第三参数，第三参数必须是一个合法的函数。");
    }
}
export default {
    yuCondition,
    yuQuery,
    yuDirty,
    yuLoading,
    yuRouter,
}