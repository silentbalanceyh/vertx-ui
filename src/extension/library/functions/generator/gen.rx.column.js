import G from '../global';
import F from './gen.common';
import Ux from "ux";

/**
 * ## 扩展函数
 *
 * 全列读取专用
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} config 列配置
 * @returns {Function} 生成函数
 */
const rxColumn = (reference, config = {}) => F.switcher(reference, 'rxColumn',
    (params) => {
        const {options = {}, columns = []} = config;
        if (options[G.Opt.DYNAMIC_COLUMN]) {
            /*
             * 动态配置
             */
            const uri = options[G.Opt.AJAX_COLUMN_FULL];
            params.module = options[G.Opt.IDENTIFIER];
            return Ux.ajaxGet(uri, params);
        } else {
            /*
             * 静态配置
             */
            return Ux.promise(columns);
        }
    });
/**
 * ## 扩展函数
 *
 * 读取我的列
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} config 列配置
 * @returns {Function} 生成函数
 */
const rxColumnMy = (reference, config = {}) => F.switcher(reference, 'rxColumnMy',
    (params) => {
        const {options = {}} = config;
        if (options[G.Opt.DYNAMIC_COLUMN]) {
            /*
             * 动态配置
             */
            const uri = options[G.Opt.AJAX_COLUMN_MY];
            params.module = options[G.Opt.IDENTIFIER];
            return Ux.ajaxGet(uri, params);
        }
    });
/**
 * ## 扩展函数
 *
 * 视图保存函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} consumer 后置函数，用于执行保存过后的回调
 * @returns {Function} 生成函数
 */
const rxColumnSave = (reference, consumer = {}) => F.switcher(reference, 'rxColumnSave',
    (params = []) => {
        const {options = {}} = reference.state;
        /* 当前组件中的状态定义 */
        const uri = options[G.Opt.AJAX_COLUMN_SAVE];
        return Ux.ajaxPut(uri, params);
    }
);
/**
 * ## 扩展函数
 *
 * 列过滤专用执行函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxProjection = (reference) => ($columnsMy = [], addOn = {}) => {
    const $my = Ux.immutable($columnsMy);
    $columnsMy = Ux.clone($columnsMy);
    if (!$my.contains('key')) {
        $columnsMy = ['key'].concat($columnsMy);
    }
    /*
     * 处理 state 中的 table 部分
     */
    let {table = {}} = reference.state;
    /*
     * 表格 table 中的内容
     */
    const state = {
        $columnsMy,// 修改 $columnsMy 变量（我的视图信息更新）
    };
    if (!Ux.isEmpty(table)) {
        /*
         * $columns 为全列
         */
        const {$columns = []} = reference.state;
        /*
         * 本次更新列为 $columnsMy
         * $calculated 为计算的保留列信息，该列在 table 中会用来更新 table.columns 的信息
         */
        const $columnsOfMy = Ux.immutable($columnsMy);
        const $calculated = $columns
            .filter(column => $columnsOfMy.contains(column.dataIndex));
        table = Ux.clone(table);
        table.columns = $calculated;
        state.table = table;// 修改 table 中专用的 table.
    }
    if (!Ux.isEmpty(addOn)) {
        Object.assign(state, addOn);
    }
    /*
     * {
     *      $columnsMy：我的视图会被更新
     *      table: 主要更新 columns
     *      $dirty: true（触发重新加载）
     * }
     */
    reference.setState(state);
};
export default {
    /* 可外置传入 */ rxColumn,
    /* 可外置传入 */ rxColumnMy,
    /* 可外置传入 */ rxColumnSave,
    /* 回调修改状态专用 */ rxProjection,
}