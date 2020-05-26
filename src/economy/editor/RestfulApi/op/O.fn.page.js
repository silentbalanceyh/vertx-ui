import Ux from "ux";
import Event from './O.event';

export default (reference) => {
    const input = Ux.fromHoc(reference, "input");
    const state = {};
    state.$ready = true;
    state.$button = input;
    /* 窗口配置 */
    const window = Ux.fromHoc(reference, "window");
    state.$dialog = Ux.configDialog(reference, window);
    /* _op */
    const op = Ux.fromHoc(reference, "op");
    if (op && op.search) {
        op.search.onChange = Event.onSearch(reference);
    }
    state.$op = op;
    /* _table */
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    state.$table = $table;
    reference.setState(state);
}