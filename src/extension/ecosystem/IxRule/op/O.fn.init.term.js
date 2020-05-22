import Ux from 'ux';
import renderColumn from '../Web.Column';
import renderTitle from '../Web.Title';

import Event from '../event';

export default (reference) => {
    const state = {};
    state.$ready = true;
    /* 表格 */
    const pending = Ux.fromHoc(reference, "pending");
    const {target = {}} = pending;
    const {table = {}} = target;
    const $table = Ux.clone(table);
    $table.title = renderTitle(reference, target);
    $table.size = "small";
    $table.pagination = false;
    $table.rowSelection = {
        type: "radio",
        columnWidth: 40,
        onChange: Event.onRowSelected(reference)
    }
    $table.columns = renderColumn(reference, $table.columns, target);
    state.$table = $table;
    /* 值格式 */
    const {value} = reference.props;
    {
        const data = [];
        if (value) {
            /* 字符串数组 */
            value.forEach((item) => {
                const each = {};
                each.key = Ux.randomUUID();
                if ("string" === typeof item) {
                    each.rules = [item];
                } else {
                    each.rules = item;
                }
                data.push(each);
            });
        } else {
            data.push({
                key: Ux.randomUUID(),
                rules: []
            })
        }
        state.data = data;
    }
    reference.setState(state);
}