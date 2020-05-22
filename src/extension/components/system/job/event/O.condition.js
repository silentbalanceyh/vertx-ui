import Ux from 'ux';

const onSearch = (reference) => (searchText) => {
    const {$query = {}} = reference.state;
    if (searchText) {
        $query.criteria["name,c"] = searchText;
    } else {
        delete $query.criteria["name,c"];
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
        // 所有任务
        delete $query.criteria['type,i'];
    } else {
        $query.criteria['type,i'] = checked;
    }
    reference.setState({$query, $condChecked: checked, $loading: true});
}
const onSelected = (reference) => (item) => {
    const {$query = {}} = reference.state;
    const {criteria = {}} = $query;
    criteria.group = item.key;
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