import Ux from "ux";

const yiList = (reference) => {
    const state = {};
    state.$ready = true;
    const card = Ux.fromHoc(reference, "card");
    if (card.extra) {
        state.$extra = Ux.clone(card.extra);
    }
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    state.$table = $table;
    // state.$query = Ux.fromHoc(reference, "query");
    reference.setState(state);
}
const rxSearch = (reference) => ($keyword = "") => {
    reference.setState({$keyword})
}
export default {
    yiList,
    rxSearch
}