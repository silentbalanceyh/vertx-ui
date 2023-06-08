import Ux from 'ux';

const onSearch = (reference) => (searchText) => {
    const {$query = {}} = reference.state;
    if (searchText) {
        $query.criteria["uri,c"] = searchText;
    } else {
        delete $query.criteria["uri,c"];
    }
    Ux.of(reference).in({
        $query,
        $condText: searchText,
        $loading: true
    }).done()
    // reference.?etState({$query, $condText: searchText, $loading: true});
}
const onRefresh = (reference) => () =>
    Ux.of(reference).loading().done();
// reference.?etState({$loading: true});

const onClean = (reference) => (event) => {
    Ux.prevent(event);
    const {$query = {}} = reference.state;
    $query.criteria = {};
    Ux.of(reference).in({
        $query,
        /* 选中控制专用 */
        $condMenu: [], $condText: "", $condChecked: [],
        $loading: true
    }).done();
    // reference.?etState({
    //     $query,
    //     /* 选中控制专用 */
    //     $condMenu: [], $condText: "", $condChecked: [],
    //     $loading: true
    // });
}
const onChecked = (reference) => (checked) => {
    const {$query = {}} = reference.state;
    if (0 === checked.length) {
        // 所有
        delete $query.criteria['method,i'];
    } else {
        $query.criteria['method,i'] = checked;
    }
    Ux.of(reference).in({
        $query,
        $condChecked: checked,
        $loading: true
    }).done();
    // reference.?etState({$query, $condChecked: checked, $loading: true});
}
const onSelected = (reference) => (item) => {
    const {$query = {}} = reference.state;
    const {criteria = {}} = $query;
    const categories = Ux.onDatum(reference, "data.category");
    const identifier = categories
        .filter(category => item.key === category.key)
        .map(category => category.identifier);
    if (identifier[0]) {
        criteria["identifier"] = identifier[0];
    }
    Ux.of(reference).in({
        $query,
        $condMenu: [item.key],
        $loading: true
    }).done();
    // reference.?etState({$query, $condMenu: [item.key], $loading: true});
}
const onSearchChange = (reference) => (event) => {
    Ux.prevent(event);
    const $condText = event.target.value;
    Ux.of(reference).in({$condText}).done();
    // reference.?etState({$condText});
}
export default {
    onSearch,
    onSearchChange,
    onRefresh,
    onClean,
    onChecked,
    onSelected,
}