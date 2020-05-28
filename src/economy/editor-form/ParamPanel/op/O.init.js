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
        /* 内置数据基础 */
        const {data = []} = reference.props;
        const $data = Ux.clone(data);
        $data.filter(item => !item.key)
            .forEach(item => item.key = Ux.randomUUID())
        state.data = $data;
        /* onChange 专用 */
        state.$ready = true;
        reference.setState(state);
    }
}