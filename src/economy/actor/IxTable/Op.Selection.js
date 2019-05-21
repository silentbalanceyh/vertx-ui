const initSelection = (reference) => {
    return {
        onChange: ($keys = []) => {
            reference.setState({$keys});
        }
    }
};
export default {
    initSelection
}