const rxSelect = (reference) => ($sourceKey, item) => {
    const {node} = item;
    const {data = {}} = node.props ? node.props : {};
    reference.setState({$inited: data});
}
export default {
    rxSelect,
}