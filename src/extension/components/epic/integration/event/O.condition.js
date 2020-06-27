import Ux from 'ux';

const onSearch = (reference) => (searchText) => {
    const {$query = {}} = reference.state;
    if (searchText) {
        $query.criteria["uri,c"] = searchText;
    } else {
        delete $query.criteria["uri,c"];
    }
    reference.setState({$query, $condText: searchText, $loading: true});
}
const onRefresh = (reference) => () =>
    reference.setState({$loading: true});

const onClean = (reference) => (event) => {
    Ux.prevent(event);
    const {$query = {}} = reference.state;
    $query.criteria = {};
    reference.setState({
        $query,
        /* 选中控制专用 */
        $condMenu: [], $condText: "", $condChecked: [],
        $loading: true
    });
}
const onChecked = (reference) => (checked) => {
    const {$query = {}} = reference.state;
    if (0 === checked.length) {
        // 所有
        delete $query.criteria['method,i'];
    } else {
        $query.criteria['method,i'] = checked;
    }
    reference.setState({$query, $condChecked: checked, $loading: true});
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
    reference.setState({$query, $condMenu: [item.key], $loading: true});
}
const onSearchChange = (reference) => (event) => {
    Ux.prevent(event);
    const $condText = event.target.value;
    reference.setState({$condText});
}
export default {
    onSearch,
    onSearchChange,
    onRefresh,
    onClean,
    onChecked,
    onSelected,
}