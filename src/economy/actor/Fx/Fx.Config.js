import Ux from "ux";
import U from 'underscore';

const hocConfig = key => reference => {
    let {$key = key} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const config = Ux.fromHoc(ref, $key);
    return Ux.clone(config);
};
const hocOptions = key => reference => {
    const config = hocConfig(key)(reference);
    const options = config.options;
    const {rxInject} = reference.props;
    return U.isFunction(rxInject) ? rxInject(options) : options;
};
const hocQuery = key => reference => {
    const config = hocConfig(key)(reference);
    const query = config.query;
    return Ux.irGrid(query, reference.props);
};
const hocTable = key => reference => {
    const config = hocConfig(key)(reference);
    return config ? config.table : {}
};
export default {
    hocConfig,
    hocOptions,
    hocQuery,
    hocTable
}