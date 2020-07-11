import Ux from 'ux';
import Event from '../event';
import Rdr from '../page';

const yiTabs = (reference) => {
    /*
     * 表格处理
     */
    const $tabs = Ux.fromHoc(reference, "tabs");
    $tabs.onEdit = Event.rxTabEdit(reference);
    $tabs.type = "editable-card";
    $tabs.hideAdd = true;
    $tabs.className = "ex-tabs";
    return Ux.promise($tabs);
}
/*
 * 模块专用 Tabular（类型处理）
 */
const yiMenu = (reference) => {
    const jobs = Ux.onDatum(reference, "job.group");
    const menus = [];
    jobs.sort(Ux.sorterAscFn("code")).forEach(item => {
        const menu = {};
        menu.key = item.code;
        menu.text = item.name;
        menu.__counter = (reference) => {
            /*
             * $aggregation 读取
             */
            const {$aggregation = {}} = reference.state;
            return ($aggregation[item.code] ? $aggregation[item.code] : 0);
        }
        menus.push(menu);
    });
    return Ux.promise(menus);
}
const yiTable = (reference) => {
    const $table = Ux.sexTable(reference, "table");
    $table.columns = [Rdr.pageColumn(reference)].concat($table.columns);
    $table.onChange = (pagination = {}, sorter, filters = {}) => {
        const pager = {
            page: pagination.current,
            size: pagination.pageSize,
        }
        const {$query = {}} = reference.state;
        $query.pager = pager;
        reference.setState({$query, $loading: true});
    }
    return Ux.promise($table);
}
export default {
    yiMenu,
    yiTabs,
    yiTable
}