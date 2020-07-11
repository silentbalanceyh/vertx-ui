import U from 'underscore';
import Ux from 'ux';
import {Dsl} from 'entity';

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
const yoAdjust = (reference) => {
    const {data = {}} = reference.props;
    const changes = U.isArray(data.items) ? data.items : [];
    return Dsl.codex(reference).bind().done(changes);
};
export default {
    yiPage,
    yoAdjust
}