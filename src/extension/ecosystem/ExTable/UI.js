import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import U from 'underscore';
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
const componentInit = (reference) => {
    const initState = {};
    /*
     * 表格配置填充
     */
    const {config = {}, $query = {}, $terms = {}} = reference.props;
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
const componentUp = (reference, previous = {}) => {
    const state = previous.prevState;
    const props = previous.prevProps;
    /*
     * 使用场景：
     * => 列筛选
     * $condition 变化处理
     * 更新条件:
     * -- 1）state 中的 $condition 发生改变时候
     */
    Ex.yuCondition(reference, {state, props});
    /*
     * 使用场景：
     * => 分页、排序、搜索，改变查询条件
     * $query 变化处理
     * 更新条件：
     * -- 1）属性中的 $query 发生变化，外层传入了最新的 $query（直接更新状态中的 $query 进入2）
     * -- 2）state 中的 $query 发生了改变, 直接刷新界面
     */
    Ex.yuQuery(reference, {state, props});
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
    Ex.yuDirty(reference, {state, props});
    /*
     * $loading 专用
     */
    Ex.yuLoading(reference, {state, props});
};

class Component extends React.PureComponent {
    state = {
        $table: {},
        $query: {},
        $stateSorter: true,     // 排序修改成可控
        $ready: false,
        // $loading: false,        // 表格内 loading 处理，是否加载数据
    };

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
            const data = U.isArray($data.list) ? $data.list : [];
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