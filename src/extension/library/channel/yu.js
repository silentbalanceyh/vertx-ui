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
 * ## 「通道」`Ex.yuQuery`
 *
 * ### 1.基础介绍
 *
 * 依次检查React属性（props）和状态（state）中的$query是否发生了改变，如果发生了改变，则需要重新加载当前列表，
 * 这种加载通常是和Qr查询引擎相关。
 *
 * ### 2.核心
 *
 * #### 2.1.重刷界面
 *
 * 重新刷新当前列表的条件有两个：
 *
 * 1. $loading = true：开启了组件加载生命周期。
 * 2. 检查的`$query`发生了变化。
 *
 * 上边条件同时满足时才会触发界面刷新。
 *
 * #### 2.2.界面刷新内容
 *
 * 界面刷新内容也分为两部分：
 *
 * 1. 列刷新（如果有列过滤，那么列刷新也是必须的）
 * 2. 数据刷新（调用`rxSearch`标准方法执行刷新）
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
 * ## 「通道」`Ex.yuDirty`
 *
 * ### 1.基本介绍
 *
 * 检查 $dirty 标记执行是否脏数据变化，如果变化则重新加载，主要检查系统中的`$dirty`标记，这个检查不做比，
 * 直接一次检查属性和状态中的基础信息。
 *
 * ### 2.核心
 *
 * ### 2.1. 检查步骤
 *
 * 1. 先检查props中的`$dirty`变量，如果已经出现脏数据，则同时设置`$dirty = true, $loading = true`。
 * 2. 第一步如果执行，则触发内部更新函数`updateInternal`
 *
 * ### 2.2. 内部函数触发条件
 *
 * 1. 当前检测变量`$dirty`发生了改变。
 * 2. 当前组件的`$loading`的值为true。
 *
 * ### 2.3. 回调
 *
 * > 该操作完成后的回调中，必须充值`$loading`为false导致不会出现死循环。
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
 * ## 「通道」`Ex.yuCondition`
 *
 * ### 1. 基础介绍
 *
 * 分别检查props，state属性中的`$condition`变量是否发生过更改，如果更改则触发componentDidUpdate流程。
 *
 * 检查结果的数据结构：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * 如果没有更新，则直接返回undefined。
 *
 * ### 2. 核心
 *
 * 扩展版本中引入了state内部的检查，最终会导致双检查流程：
 *
 * 1. 如果props中的`$condition`发生过改变，则执行`$condition`重设重设条件。
 * 2. 如果state中的`$condition`发生过改变，则调用`rxCondition`函数重设条件。
 *
 * > 目前流程使用的场景只有上边两种，可能存在考虑不周的情况。
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
 * ## 「通道」`Ex.yuLoading`
 *
 * ### 1.基本介绍
 *
 * 直接执行纯的 $loading，检查当前属性 props 和 state 中的 loading 是否变化。
 *
 * 1. props 中的 $loading：外置传入
 * 2. state 中的 $loading：内置传入
 *
 * ### 2.核心
 *
 * React包含了两个核心对象
 *
 * |对象名|含义|
 * |:---|:---|
 * |props|React组件属性（全部只读）|
 * |state|React组件状态（可写）|
 *
 * 这个方法检查这两个对象之间是否维持了一致，当一个组件被外部直接设置了`$loading = true`，那么表示父组件驱动子组件执行强制加载，
 * 这个时候会触发**开始加载**的动作。加载完成后，父组件会传第二次`$loading = false`到子组件，那么此时子组件也会完成自我更新
 * 以及自我驱动。
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
 * ## 「通道」`Ex.yuRouter`
 *
 * ### 1. 基本介绍
 *
 * 特殊方法，该方法在`Ux.isRoute`之前，需要和它做出对比：
 *
 * * `Ux.isRoute`是检查路由的路径是否发生更改（无关参数），返回true/false值。
 * * `Ex.yuRouter`是检查路由路径中的参数是否发生了更改，直接执行回调。
 *
 * ### 2. 代码示例
 *
 * ```js
 * const reference = this;
 * Ex.yuRouter(reference, {props, state}, () =>
 *      Ex.yiStandard(reference).then(Ux.pipe(reference)));
 * ```
 *
 * 操作界面同样是如下，左边点击菜单时只会发生参数更改，路由路径不变化。
 *
 * ```
 * |--------------------------------------------------|
 * |  Menu  |  Content ( List )                       |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |--------------------------------------------------|
 * ```
 *
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