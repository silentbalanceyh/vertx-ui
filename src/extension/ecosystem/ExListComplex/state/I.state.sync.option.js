import Ux from "ux";
import U from "underscore";

export default (reference, config = {}) => {
    const options = Ux.clone(config.options);
    const {rxInject} = reference.props;
    let $options = {};
    if (U.isFunction(rxInject)) {
        $options = rxInject(options);
    } else {
        $options = Ux.sorterObject(options);
    }
    return $options;
};