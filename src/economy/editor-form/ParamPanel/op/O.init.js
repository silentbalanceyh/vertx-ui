import Ux from 'ux';
import uiColumn from '../Web.Column';

export default {
    yiPage: (reference) => {
        const state = {};
        /* _op */
        const $op = Ux.fromHoc(reference, "op");
        /* 表格配置 */
        const table = Ux.fromHoc(reference, "table");
        const $table = Ux.clone(table);
        $table.columns = [uiColumn(reference, $op)]
            .concat(Ux.configColumn(reference, $table.columns));
        state.$table = $table;
        /* onChange 专用 */
        state.$ready = true;
        reference.setState(state);
    }
}