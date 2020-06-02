export default {
    rowRefresh: (reference, $cells = []) => {
        reference.setState({$cells});
    }
}