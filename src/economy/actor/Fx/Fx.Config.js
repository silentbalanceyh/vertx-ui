import Ux from "ux";
import U from 'underscore';

const hocConfig = type => reference => {
    let {$key = type} = reference.props;
    const ref = Ux.onReference(reference, 1);
    const config = Ux.fromHoc(ref, $key);
    return Ux.clone(config);
};
const hocOptions = type => reference => {
    const config = hocConfig(type)(reference);
    const options = config.options;
    const {rxInject} = reference.props;
    return U.isFunction(rxInject) ? rxInject(options) : options;
};
const hocQuery = type => reference => {
    const config = hocConfig(type)(reference);
    const query = config.query;
    return Ux.irGrid(query, reference.props);
};
const hocTable = type => reference => {
    const config = hocConfig(type)(reference);
    return config ? config.table : {};
};
export default {
    hocConfig,
    hocOptions,
    hocQuery,
    hocTable
};