import Ux from 'ux';

const fetchConfig = (reference = {}, key) => {
    let {$key = key} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const config = Ux.fromHoc(ref, $key);
    return Ux.clone(config);
};
const fetchOption = (reference = {}, config = {}) => {
    const options = config.options;
    const {rxInject} = reference.props;
    if (rxInject) {
        return rxInject(options);
    } else {
        return options;
    }
};
const fetchQuery = (reference = {}, config = {}) => {
    const query = config.query;
    return Ux.irGrid(query, reference.props);
};
export default {
    fetchConfig,
    fetchOption,
    fetchQuery,
};