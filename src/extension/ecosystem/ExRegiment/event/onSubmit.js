import Ux from 'ux';
import U from 'underscore';

export default (reference, config = {}) => (event) => {
    Ux.prevent(event);
    const {$selected = []} = reference.state ? reference.state : {};
    if (0 === $selected.length) {
        const {validation = ""} = config;
        if (validation) {
            Ux.messageFailure(validation)
        }
    } else {
        const {rxSubmit} = reference.props;
        if (U.isFunction(rxSubmit)) {
            rxSubmit($selected);
        }
    }
}