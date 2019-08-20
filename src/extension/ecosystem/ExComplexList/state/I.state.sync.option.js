import Ux from "ux";
import U from "underscore";

export default (reference, config = {}) => {
    const options = Ux.clone(config.options);
    const {rxInject} = reference.props;
    if (U.isFunction(rxInject)) {
        return rxInject(options);
    } else {
        return options;
    }
};