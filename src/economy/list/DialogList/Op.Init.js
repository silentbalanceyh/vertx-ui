import Ux from "ux";
import Immutable from "immutable";
import Fn from '../../_internal/Ix.Fn';

const readConfig = (reference = {}) => Fn.fetchConfig(reference, "sublist");

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
        return Immutable.fromJS(config).toJS();
    }
};
export default {
    readOption,
    readTable,
    readWindow
};