import Ux from 'ux';

const onSearch = (reference) => (searchText) => {
    const {$query = {}} = reference.state;
    if (searchText) {
        $query.criteria["$1"] = {
            "name,c": searchText,
            "comment,c": searchText
        };
    } else {
        delete $query.criteria["$1"];
    }
    Ux.of(reference).in({
        $query,
        $condText: searchText,
    }).loading(false).done();
    // reference.?etState({$query, $condText: searchText, $loading: true});
}
const onRefresh = (reference) => () =>
    Ux.of(reference).loading(false).done();
// reference.?etState({$loading: true});
const onClean = (reference) => (event) => {
    Ux.prevent(event);
    const {$query = {}, $pagination = {}} = reference.state;
    $query.criteria = {};
    $pagination.current = 1;
    Ux.of(reference).in({

        $query,
        /* 选中控制专用 */
        $condMenu: [], $condText: "", $condChecked: [],
    }).loading(false).done();
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
        // 所有任务
        delete $query.criteria['type,i'];
    } else {
        $query.criteria['type,i'] = checked;
    }
    Ux.of(reference).in({
        $query,
        $condChecked: checked
    }).loading(false).done();
    // reference.?etState({$query, $condChecked: checked, $loading: true});
}
const onSelected = (reference) => (item) => {
    const {$query = {}, $pagination = {}} = reference.state;
    const {criteria = {}} = $query;
    criteria.group = item.key;
    {
        $pagination.current = 1;
        if ($query.pager) {
            $query.pager.page = 1;
        }
    }
    Ux.of(reference).in({
        $query, $condMenu: [item.key], // $loading: true,
        $pagination,
    }).loading(false).done()
    // reference.?etState({
    //     $query, $condMenu: [item.key], $loading: true,
    //     $pagination,
    // });
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