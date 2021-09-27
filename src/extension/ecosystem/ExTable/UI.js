import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Jsx from './Web';
import Event from "./Op";


/**
 * ## 「组件」`ExTable`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method *ExTable
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentState = (props = {}) => {
    const initState = {};
    /*
     * 表格配置填充
     */
    const {config = {}, $query = {}, $terms = {}} = props;
    initState.$table = Ux.clone(config);
    initState.$table.loading = true;        // 加载中（数据未完成）
    initState.$table.className = Ux.Env.ECONOMY.TABLE_CONTROL;
    /*
     * 默认的 query：只考虑 props 中传入的 $query
     * 1）读取默认的 query：props -> $query
     * 2）更新过后的 query：state -> $query
     */
    initState.$query = Ux.clone($query);
    /*
     * 变量中存储了列过滤专用信息
     */
    initState.$terms = $terms;
    initState.$stateSorter = true;
    initState.$ready = false;
    return initState
}
const componentInit = (reference) => {
    const initState = reference.state;
    /*
     * 初始化数据
     */
    Ux.promise(initState)
        .then(state => {
            /*
             * 第一次读取
             */
            if (state.$query) {
                return Ex.rx(reference).search(state.$query)
                    .then(data => Ex.yiColumn(reference, state, data));
            } else {
                return Ex.E.error008();
            }
        })
        .then(state => {
            /*
             * 1. onRow
             */
            const row = state.$table.row;
            state.$table.onRow = Event.onRow(reference, row);
            if (row && row.onDoubleClick) {
                state.$table.rowClassName = "ex-row-double";
            }
            /*
             * 2. onChange
             */
            state.$table.onChange = Event.onChange(reference);
            return Ux.promise(state);
        })
        .then(state => {
            if (!state.error) {
                /*
                 * 无错
                 */
                state.$ready = true;
                Ux.dgQuery(reference, "Table 组件：$loading = true");
                reference.setState(state);
            } else {
                console.error(state);
            }
        })
        .catch(error => {
            /*
             * For Debug
             */
            console.error(error);
        })
}
// ----------------------- 旧代码
/*
 * 使用场景：
 * => 列筛选
 * $condition 变化处理
 * 更新条件:
 * -- 1）state 中的 $condition 发生改变时候
 */
// Ex.yuCondition(reference, {state, props});
/*
 * 使用场景：
 * => 分页、排序、搜索，改变查询条件
 * $query 变化处理
 * 更新条件：
 * -- 1）属性中的 $query 发生变化，外层传入了最新的 $query（直接更新状态中的 $query 进入2）
 * -- 2）state 中的 $query 发生了改变, 直接刷新界面
 */
// Ex.yuQuery(reference, {state, props});
/*
 * 使用场景：（内部刷新）
 * 控制位置：
 * 1）外置 props -> $dirty 变成了 true
 * 2）内置 state -> $dirty 变成了 true
 * => 清除筛选
 * $dirty = true 时刷新
 * 更新条件：（不等待外层异步完成，直接刷新）
 * -- 1）外层传入了 $dirty，即 $dirty 为 true，更新内部的 $dirty（进入2）
 * -- 2）state 中的 $dirty 发生了变化，并且是 true，直接刷新界面
 */
// Ex.yuDirty(reference, {state, props});
/*
 * $loading 专用
 */
// Ex.yuLoading(reference, {state, props});
// ----------------------- 旧代码
/*
 * 内置比较
 */
const diffInternal = (state, prevState) => {
    const checkICond = Ex.upCondition(state, prevState);
    const checkIQr = Ex.upQuery(state, prevState);
    const checkISorter = Ex.upValue(state, prevState, "$sorter");
    const newState = {}
    if (checkICond || checkIQr || checkISorter) {
        if (checkICond) {
            newState.$condition = checkICond.current;
        }
        if (checkISorter) {
            newState.$sorter = checkISorter.current;
        }
        if (checkIQr) {
            newState.$query = checkIQr.current;
        }
    }
    const {$dirty = false} = state;
    if ($dirty) {
        newState.$dirty = true;
    }
    if (Ux.isNotEmpty(newState)) {
        Ux.dgDebug(newState, "[ ExTable ] 内循环检查结果", "#ca3d3e")
        return newState;
    }
}
const diffExternal = (props, prevProps) => {
    const checkCond = Ex.upCondition(props, prevProps);
    const checkQr = Ex.upQuery(props, prevProps);
    const {$dirty = false} = props;
    // 三个条件任意一个条件满足，则执行
    const newState = {}
    if (checkCond || checkQr || $dirty) {
        if (checkCond) {
            // $condition
            newState.$condition = checkCond.current;
        }

        if (checkQr) {
            // $query
            newState.$query = checkQr.current;
        }
    }
    // $dirty
    newState.$dirty = $dirty;
    /**
     * 外更新条件
     * 1. 如果只有一个 $dirty = false 则不更新
     * 2. 如果 $dirty = true 则单独刷新
     */
    if (1 === Object.keys(newState).length) {
        // 1. undefined,长度1，证明会有其他检查结果
        // 2. 如果 $dirty = true,长度1，则是强制刷新
        if (undefined === newState.$dirty || newState.$dirty) {
            Ux.dgDebug(newState, "[ ExTable ] 外循环检查结果", "#ca3d3e")
            return newState
        }
    } else {
        // 长度为0则返回undefined
        if (Ux.isNotEmpty(newState)) {
            Ux.dgDebug(newState, "[ ExTable ] 外循环检查结果", "#ca3d3e")
            return newState;
        }
    }
}
const componentUp = (reference, previous = {}) => {
    const prevState = previous.prevState;
    const prevProps = previous.prevProps;
    const state = reference.state;
    const props = reference.props;
    // -------------------- 先检查外部变量 ----------------------
    /*
     * 检查外部变量
     * 1. $dirty
     * 2. $query
     * 3. $condition
     * 4. $loading
     *
     * 四个变量都会从外层传入，分类如下
     * 1. $dirty：外层传入，内循环，里层修改
     * 2. $query
     *    $condition
     *    -- 外层传入，内循环
     * 3. $loading：外层单独控制内层的 $loading 效果
     */
    const checkExternal = diffExternal(props, prevProps);
    const checkInternal = diffInternal(state, prevState);
    if (checkExternal && !checkInternal) {
        // 外驱动
        const $query = checkExternal.$query;
        const $dirty = checkExternal.$dirty;
        // $dirty = true
        // -- 有 $query 用新 $query
        // -- 无 $query 用旧 $query
        // $dirty = false
        // -- 有 $query 用新 $query刷新
        // -- 无 $query 则不刷新
        const params = {}
        if ($query) {
            params.$query = $query;
            // $query发生改变（直接外驱动）
            Ux.dgDebug(params, "[ ExTable ] 触发内循环！", "#1874CD");
            reference.setState(params);
        } else {
            if ($dirty) {
                // $query发生改变（直接外驱动）
                Ux.dgDebug(params, "[ ExTable ] （脏）触发内循环！", "#1874CD");
                params.$loading = true;
                params.$dirty = true;
                reference.setState(params);
                /*
                 * 这种方式必须 setTimeout
                 * 只有在 timeout 有值的时候会保证上层更新已经全部完成
                 * 而新的更新可以导致上层更新成功进入下一次操作
                 */
                Ux.toLoading(() => Ex.rx(reference).dirty(false))
            }
        }
    } else if (!checkExternal && checkInternal) {
        // 内驱动
        const $condition = checkInternal.$condition
        if ($condition) {
            // $condition被修改 --------> 触发外驱动
            Ux.dgDebug(checkInternal, "[ ExTable ] 触发外循环！", "#1874CD");
            Ex.rx(reference).condition(checkInternal.$condition)
        } else {
            const $query = checkInternal.$query;
            if ($query) {
                reference.setState({$loading: true});
                // $query被修改（直接内驱动）
                Event.onFresh(reference, {$query});
            } else {
                const isDirty = checkInternal.$dirty;
                if (isDirty) {
                    const {$query} = state;
                    reference.setState({$loading: true});
                    // $query被修改（直接内驱动）
                    Event.onFresh(reference, {$query});
                }
            }
        }
    } else if (checkExternal && checkInternal) {
        /*
         * 内外交互只会出现一种情况，即外循环第一次还没执行完，依旧是：
         * {$dirty:true}
         * 而此处不能哪种检查，只需要做一件事，就是检查 checkInternal
         */
    } else {
        // 不刷新
        Ux.dgDebug({
            checkExternal,
            checkInternal
        }, "[ ExTable ] 界面已经全部同步完成！", "#33af43");
    }
};

class Component extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = componentState(props)
    }

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {prevProps, prevState});
    }

    render() {
        // console.info(this.props.$query);
        return Ex.yoRender(this, () => {
            const {$table = {}, $data = {}, $loading = false} = this.state;
            /*
             * （必须动态，执行列选择）处理 columns
             */
            const {config = {}} = this.props;
            const $columns = config.columns ? config.columns : [];
            $table.columns = Jsx.renderColumn(this, $columns);
            /*
             * （必须结合数据）分页组件
             */
            $table.pagination = Jsx.renderPager(this, $data);
            /*
             * 选中项处理
             */
            const rowSelection = Jsx.renderSelection(this);
            if (rowSelection) {
                $table.rowSelection = rowSelection;
            }
            /*
             * 加载效果
             */
            $table.loading = $loading;
            const data = Ux.isArray($data.list) ? $data.list : [];
            /*
             * 修改 x
             */
            Ux.configScroll($table, data, this);
            return Jsx.renderContent(this, {
                table: Ux.clone($table),
                data
            });
        }, Ex.parserOfColor("ExTable").private());
    }
}

export default Component;