import Event from '../event';
import Ux from 'ux';
import renderOp from './Web.Op';

const yiPage = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 三个组件的专用配置处理
     */
    const {
        search = {}, ajax = {},
        table = {}, divider = {},
        submit = {}, category = {}
    } = config;
    const $search = {};
    {
        /*
         * 搜索专用
         */
        const {condition = [], ...restSearch} = search;
        Object.assign($search, restSearch);
        /* 必须支持清空 */
        $search.allowClear = true;
        $search.onSearch = Event.onSearch(reference, {condition})
    }
    const $query = {};
    {
        /*
         * 查询参数 $query
         * 1）默认 100 条（第一页，每一页100条）
         * 2）参数来源：$condition
         * - config.ajax.magic - 配置中的参数
         * - 搜索框的配置（带清空）
         * - 选择左边树（带清空）
         */
        if (ajax.magic) {
            /*
             * 性能考虑
             */
            $query.pager = {page: 1, size: 100};
            $query.criteria = Ux.parseInput(ajax.magic, reference);
        }
    }
    const $table = {};
    const $tabulation = {};
    const $divider = {};
    {
        /*
         * 表格专用
         */
        const {columns = {}, ...restTable} = table;
        Object.assign($table, restTable);
        $table.columns = Ux.configColumn(reference, columns);
        $table.className = "regiment-table";
        $table.pagination = {simple: true, size: "small"};
        {
            /*
             * 选择项
             */
            Object.assign($tabulation, Ux.clone($table));
            /*
             * $tabulation 需要追加: 删除选项额按钮
             */
            if (config.remove) {
                $tabulation.columns = [renderOp(reference, config.remove)]
                    .concat($tabulation.columns);
            }
            if (!Ux.isEmpty(divider)) {
                Object.assign($divider, divider);
            }
        }
        $table.rowSelection = Event.onSelection(reference);
    }
    const $submit = {};
    {
        const {validation = "", ...rest} = submit;
        Object.assign($submit, rest);
        $submit.onClick = Event.onSubmit(reference, {validation});
    }
    /*
     * $category 专用
     */
    const $category = {};
    const $path = {};
    if (category.source) {
        const dataSource = Ux.onDatum(reference, category.source);
        const config = category.tree;
        $category.data = dataSource;
        $category.config = config;
        $category.fnSelect = Event.onSelect(reference, category.selected);
        /*
         * 处理 $path
         */
        const path = Ux.treeFlip(dataSource, {parent: "parentId", keyField: "key"});
        if (path) {
            Object.assign($path, path);
        }
    }
    /*
     * 专用 $ready = true
     * 状态更新
     */
    const state = {
        $table, $search, $query, $path,
        $tabulation, $divider,
        $category,
        $submit, $ready: true
    };
    reference.setState(state);
};
const yuPage = (reference, virtualRef = {}) => {
    const {$query = {}} = reference.state;
    const previous = virtualRef.state.$query;
    if (Ux.isDiff($query, previous)) {
        Event.onRefresh(reference);
    }
};
const yoData = (reference) => {
    const {$data = [], $selected = []} =
        reference.state ? reference.state : {};
    const $keys = Ux.immutable($selected.map(each => each.key));
    return $data.filter(each => !$keys.contains(each.key));
};
export default {
    yiPage,
    yuPage,
    yoData
}