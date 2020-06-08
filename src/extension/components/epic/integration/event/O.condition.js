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
    onSelected,
}