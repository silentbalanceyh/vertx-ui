import __Zn from './zero.module.dependency';
import __WD from './equip.fn.width.calculate';
import __V_PARSER from './table.__.fn._.width.parser';
import WebColumn from './variant-column';

const Cv = __Zn.Env;

const configScroll = ($table = {}, data = [], reference) => {
    const $columns = $table.columns;
    /*
     * 计算当前列的最大长度
     */
    // eslint-disable-next-line
    $columns.forEach(column => {
        /*
         * 当前列的数据信息
         * rdData：当前数据列所有数据信息
         * rdType：当前数据列渲染方式
         * rdTitle：当前数据列的标题长度
         * rdWidth：当前数据列是否设置了宽度
         */
        const rdType = column[Cv.K_NAME.V_COLUMN.RENDER] ? column[Cv.K_NAME.V_COLUMN.RENDER] : "INPUT";
        const rdTitle = column.title;
        const rdWidth = column.width;

        /*
         * 计算 width 的新算法
         * 1）先根据 render 计算 width
         * 2）如果 width > rdWidth，那么修改原始的 width
         */
        const executor = __V_PARSER[rdType];
        if (__Zn.isFunction(executor)) {
            const titleWidth = __WD.widthTitle(rdTitle, column);
            const calculated = executor(titleWidth, column, data, reference);
            if (!column.ellipsis) {
                if (rdWidth) {
                    if (!column.fixed) {
                        // 左右工具栏不参与运算，要固定宽度
                        column.width = Math.max(titleWidth, calculated, rdWidth);
                    }
                } else {
                    column.width = Math.max(titleWidth, calculated);
                }
            }
        }
    });
    /*
     * 可支持的最大宽度
     * 未配置 scroll 的时候计算，配置了就不用计算了
     */
    if (!$table.scroll || !$table.scroll.x) {
        /*
         * 基础计算：必须是超过6列才执行
         */
        if (!$table.scroll) {
            $table.scroll = {};
        }
        $table.scroll.x = 'max-content';
        /*
         * className 计算
         */
        let className = $table.className;
        if (!className) {
            className = "";
        }
        // className = `${className} ?eb-table-adjust`;
        $table.className = className;
    }
}
const configColumnAmb = (reference, columns = [], ops = {}, renderSource = {}) => {
    /*
     * 先执行基本解析
     */
    columns = __Zn.aiExprColumn(columns);
    /*
     * 警告：Columns should all contain `filteredValue` or not contain `filteredValue`.
     * 解决办法，针对所有列执行受控和非受控处理
     */
    const controlled = columns.filter(columns => columns.hasOwnProperty(Cv.K_NAME.FILTER)).length > 0;
    /*
     * 遍历每一个列执行注入
     */
    columns.forEach(column => {
        // $render处理
        WebColumn.columnRender(reference, column, ops, renderSource);
        // $render处理完成过后，可考虑包装
        WebColumn.columnWrapper(reference, column);
        if (controlled) {
            // $filter过滤处理
            WebColumn.columnFilter(reference, column);
        }
        // sorter = true 是否开启可控模式
        WebColumn.columnSorter(reference, column);
        // title替换
        WebColumn.columnSynonym(reference, column);
    });
    return columns;
};

const configTableAmb = (reference, table = {}, ops = {}, renderSource = {}) => {
    /*
     * 基本表格
     * 1）无分页
     * 2）计算了 scroll
     */
    const $tableInput = __Zn.clone(table);
    const {limitation, ...$table} = $tableInput;
    if (!table.hasOwnProperty("className")) {
        table.className = 'ux_table';
    }
    if (!table.hasOwnProperty('pagination')) {
        $table.pagination = false;
    }
    /*
     * 不包含 scroll 属性
     */
    if (!table.hasOwnProperty("scroll")) {
        if (undefined !== limitation && 0 < limitation) {
            const y = 38 * limitation;
            $table.scroll = {
                y
            }
        }
    }
    $table.columns = configColumnAmb(reference, table.columns, ops, renderSource);
    /*
     * 从 ops 中提取 $renders
     */
    const {$renders = {}} = ops;
    $table.columns.forEach(each => {
        if (__Zn.isFunction($renders[each.dataIndex])) {
            each.render = $renders[each.dataIndex];
        }
    });
    return $table;
};
export default {
    configScroll,
    configColumnAmb,
    configTableAmb,
}