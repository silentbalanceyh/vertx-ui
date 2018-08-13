import Ux from "ux";
import Immutable from "immutable";

const readConfig = (reference = {}) => {
    const {$key = "_sublist"} = reference.props;
    const ref = reference.props.reference;
    const sublist = Ux.fromHoc(ref, $key);
    return sublist ? Immutable.fromJS(sublist).toJS() : {};
};

const readOption = (reference) => readConfig(reference).options;
const readTable = (reference) => readConfig(reference).table;
const readWindow = (reference, key) => {
    const window = readConfig(reference).window;
    let config = {};
    if (window[key]) {
        config = window[key];
        if ("string" === typeof config) {
            config = Ux.aiExprWindow(config);
        }
        return config;
    }
};
export default {
    readOption,
    readTable,
    readWindow
}