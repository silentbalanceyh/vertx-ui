import Event from '../event';
import Ux from 'ux';
import yoData from './yo.data';

const yiPage = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 三个组件的专用配置处理
     */
    const {
        search = {}, ajax = {},
        table = {}, list = {},
        submit = {}
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
        $search.onSearch = Event.onSearch(reference, {condition, ajax})
    }
    const $table = {};
    {
        /*
         * 表格专用
         */
        const {columns = {}, ...restTable} = table;
        Object.assign($table, restTable);
        $table.columns = Ux.configColumn(reference, columns);
        $table.size = "small";
        $table.rowSelection = Event.onSelection(reference);
    }
    const $list = {};
    {
        Object.assign($list, list);
    }
    const $submit = {};
    {
        const {validation = "", ...rest} = submit;
        Object.assign($submit, rest);
        $submit.onClick = Event.onSubmit(reference, {validation});
    }
    /*
     * 专用 $ready = true
     * 状态更新
     */
    const state = {
        $table, $search, $list,
        $submit, $ready: true
    };
    reference.setState(state);
};
export default {
    yiPage,
    yoData,
}