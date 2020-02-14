import Dt from '../datum';
import U from "underscore";

const formAdvReset = (reference, keys = []) => {
    const {form} = reference.props;
    if (form) {
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
        }
        /*
         * callback，reset回调
         */
        const {doReset} = reference.props;
        if (U.isFunction(doReset)) {
            doReset(keys, reference);
        }
    } else {
        const ref = Dt.onReference(reference, 1);
        if (ref) {
            formAdvReset(ref, keys)
        }
    }
};

export default {
    formAdvReset
}