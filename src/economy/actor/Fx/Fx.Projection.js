import U from 'underscore';
import Ux from "ux";
import Q from "q";
import Etat from './Fx.Etat';

const _asyncColumn = (reference) => {
    const {$MOCK_COLUMN = {}} = reference.props;
    const {FULL = {}, CURRENT = {}} = $MOCK_COLUMN;
    const {options = {}} = reference.state;
    /*
     * 加载两种信息
     * 1. 当前模块可以访问的全信息
     * 2. 当前视图个人保存信息
     */
    const params = {module: options['column.module']};
    const fullPromise = Ux.ajaxGet(options['ajax.column.full'], params, FULL);
    const myPromise = Ux.ajaxGet(options['ajax.column.my'], params, CURRENT);
    const promise = [];
    promise.push(fullPromise);
    promise.push(myPromise);
    /*
     * 使用 Q
     */
    return Q.all(promise);
};
const initColumn = (reference) => {
    const {options = {}} = reference.state;
    if (options['column.dynamic']) {
        // 开启动态验证才会使用的流程
        const {readyColumn = false} = reference.state;
        /* 列信息只读取一次 */
        if (!readyColumn) {
            _asyncColumn(reference)
                .then((response = []) => {
                    // 当前界面使用的所有列信息
                    const columns = response[0];
                    const projection = response[1];
                    /* 状态变更 */
                    const state = Etat.Query.projection(reference, projection);
                    /*
                     * 更新的几个键值：
                     * 1. columns：当前模块能访问的所有列信息，包括列的 render
                     * 2. projection：当前模块用户存储的个人列信息（第一次无）
                     * 3. query：根据列更新的 query 信息
                     * 4. 闭合 readyColumn = true
                     */
                    reference.setState({columns, ...state, readyColumn: true});
                });
        }
    } else {
        reference.setState({ready: true}); // 未开启动态验证处理
    }
};
const inheritProjection = (reference, inherit) => {
    // 这个调用只能在 顶层容器中
    const {options = {}} = reference.state;
    if (options['column.dynamic']) {
        const {projection = [], columns = []} = reference.state;
        /* 列过滤专用函数 */
        inherit.fnFilterColumn = item => {
            if (0 === projection.length) {
                /* 如果projection 长度为 0，不过滤 */
                return true;
            } else {
                /* 如果有内容，则直接选择过滤行 */
                const dataIndexes = projection
                    .map(item => item.dataIndex);
                dataIndexes.push('key');
                /* 构造Immutable */
                const $projection = Ux.immutable(dataIndexes);
                return $projection.contains(item.dataIndex);
            }
        };
        /* 修改列函数 */
        inherit.fnProjection = (columns = []) => {
            const state = Etat.Query.projection(reference, columns);
            reference.setState(state);
        };
        /* 特殊函数处理（继承）*/
        inherit.$columns = Ux.clone(columns);
        Object.freeze(inherit.$columns);
    }
};
const mapColumns = (reference, columns = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return columns.filter(fnFilterColumn);
    } else return columns;
};

const mapOptions = (reference, options = []) => {
    const {fnFilterColumn} = reference.props;
    if (U.isFunction(fnFilterColumn)) {
        return options.filter(item => fnFilterColumn({dataIndex: item.key}));
    } else return options;
};
const _initSelected = (reference) => {
    const {$table = {}, $options = {}, $columns = []} = reference.props;
    let source = [];
    if ($options['column.dynamic']) {
        source = Ux.clone($table.columns).concat($columns);
    } else {
        source = Ux.clone($table.columns);
    }
    // 列过滤
    return mapColumns(reference, source)
        .map(column => column.dataIndex)
        // 选择项处理（过滤掉 key 信息）
        .filter(key => 'key' !== key);
};
const _initOptions = (reference, config = {}) => {
    const {$columns = []} = reference.props;
    const {full = {}} = config;
    let $options = Ux.RxAnt.toOptions(reference, full);
    /* Immutable */
    const dataIndexes = $columns.map(item => item.dataIndex);
    dataIndexes.push('key');
    const $filtered = Ux.immutable(dataIndexes);
    return $options.filter(item => $filtered.contains(item.key));
};
const initColumnWithSelected = (reference, config = {}) => {
    // 列过滤
    let $selected = _initSelected(reference);
    let $options = _initOptions(reference, config);
    return {$selected, $options};
};
export default {
    mapOptions, // 下拉列过滤专用函数
    mapColumns, // 设置默认的列信息，用于 Table 控件中做列过滤
    initColumn, // 初始化列信息，位于顶层ComplexList中
    initColumnWithSelected, // 初始化 选中 和 所有 （子组件中使用）
    inheritProjection,  // 从ComplexList继承
};