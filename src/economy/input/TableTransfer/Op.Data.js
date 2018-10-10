const _fn2Filter = (reference, item) => () => {
    const {filters} = reference.state;

};
const getFrom = (reference, config = {}) => {
    const {source = []} = reference.props;
    const {selected = [], _data = []} = reference.state;

    return _data;
};
const getTo = (reference) => {
    const {source = []} = reference.props;
    const {selected = [], _data = []} = reference.state;

    return _data;
};
export default {
    getFrom,
    getTo
}