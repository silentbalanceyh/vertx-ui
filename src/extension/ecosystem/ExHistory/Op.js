import U from 'underscore';
import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    const {data} = reference.props;
    if (data) {
        state.$multi = U.isArray(data);
        state.$ready = true;
        const table = Ux.fromHoc(reference, "table");
        const $table = Ux.clone(table);
        $table.columns = Ux.configColumn(reference, table.columns);
        $table.pagination = false;
        $table.className = "ex-history";
        state.$table = $table;
        reference.setState(state);
    }
};
export default {
    yiPage
}