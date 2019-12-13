import Event from '../event';
import Ux from 'ux';
import renderOp from './Web.Op';

const yiPage = (reference) => {
    const {config = {}, $selected = []} = reference.props;
    const configuration = Ux.fromHoc(reference, "regiment");
    if (!Ux.isEmpty(config)) {
        Object.assign(configuration, config);
    }
    /*
     * 三个组件的专用配置处理
     */
    const {
        search = {},
        table = {}, divider = {},
        submit = {}, category = {}
    } = configuration;
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
    const $query = Event.yoQuery(reference, configuration);
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
        $table.pagination = {simple: true, size: "small", pageSize: 6};
        {
            /*
             * 选择项
             */
            Object.assign($tabulation, Ux.clone($table));
            /*
             * $tabulation 需要追加: 删除选项额按钮
             */
            if (configuration.remove) {
                $tabulation.columns = [renderOp(reference, configuration.remove)]
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
        $submit, $ready: true,
        config: configuration,
        $selected
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
export default {
    yiPage,
    yuPage
}