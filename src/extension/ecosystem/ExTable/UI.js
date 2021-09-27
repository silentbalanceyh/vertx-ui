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
     *
     */
    // 优先检查
    // props / state 中的 $loading
    const outLoading = props.$loading;
    const inLoading = state.$loading;

    const updatedState = {}
    if (outLoading && !inLoading) {
        updatedState.$loading = true;
        // 外组件为true，内组件为 false，则执行
    }
    const checkCond = Ex.upCondition(props, prevProps);
    const checkQr = Ex.upQuery(props, prevProps);
    const {$dirty = false} = reference.props;
    // 三个条件任意一个条件满足，则执行
    if (checkCond || checkQr || $dirty) {

        if (checkCond) {
            // $condition
            updatedState.$condition = checkCond.current;
        }

        if (checkQr) {
            // $query
            updatedState.$query = checkQr.current;
        }

        if ($dirty) {
            // $dirty
            updatedState.$dirty = true;
        }
        updatedState.$loading = true;
        Ux.dgDebug(updatedState, "[ ExU ] 外循环检查结果", "#ca3d3e")
    }
    // 只要 updateState不为空，则执行更新
    if (Ux.isEmpty(updatedState)) {
        // 开始执行内循环，此时 updatedState为空
        // 此时 $loading = true
        // 最终想办法将 $loading 改成 false
        const innerState = {}
        const checkICond = Ex.upCondition(state, prevState);
        const checkIQr = Ex.upQuery(state, prevState);
        const checkISorter = Ex.upValue(state, prevState, "$sorter");
        if (checkICond || checkIQr || checkISorter) {
            if (checkICond) {
                innerState.$condition = checkICond.current;
            }
            if (checkISorter) {
                innerState.$sorter = checkISorter.current;
            }
            if (checkIQr) {
                innerState.$query = checkIQr.current;
            }
            Ux.dgDebug(innerState, "[ ExU ] 内循环检查结果", "#ca3d3e")
        }
        if (Ux.isEmpty(innerState)) {
            Ux.dgDebug(state.$query, "[ ExU ] $query 没有任何改变，不刷新！", "#6E8B3D");
        } else {
            const condition = innerState.$condition
            if (condition) {
                Ux.dgDebug(condition, "[ ExU ] 更新外层条件")
                Ex.rx(reference).condition(condition);
            } else {
                // 直接加载（然后执行下一步）
                reference.setState({$loading: true});
                // 执行数据加载
                const params = innerState.$query;
                Ux.toLoading(() => Ex.rx(reference).search(params)
                    .then($data => Ex.yiColumn(reference, state, $data))
                    .then(processed => {
                        const {$data, $lazy} = processed;
                        innerState.$data = $data
                        innerState.$lazy = $lazy
                        Ex.rsLoading(reference, false)(innerState);
                    })
                )
            }
        }
    } else {
        // 如果 $dirty = true，则需要关闭外层
        if ($dirty) {
            Ux.dgDebug({$dirty: false}, "[ ExU ] 更新外层脏状态")
            Ex.rx(reference).dirty(false);
        } else {
            // 执行内层状态更新
            reference.setState(updatedState);
        }
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