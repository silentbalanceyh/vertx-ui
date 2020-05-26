import Ux from 'ux';

export default (reference) => {
    const state = {};
    state.$ready = true;
    /* _op */
    state.$op = Ux.fromHoc(reference, "op");
    /* 窗口配置 */
    const window = Ux.fromHoc(reference, "window");
    state.$dialog = Ux.configDialog(reference, window);
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    state.$table = $table;
    /* 数据信息 */
    reference.setState(state);
}