import Ux from 'ux';
import U from 'underscore';

const irExClear = (reference = {}) => (event) => {
    event.preventDefault();
    Ux.formReset(reference);
};
const irExFilter = (reference = {}) => (event) => {
    event.preventDefault();
    /* 读取表单数据 */
    const {form, fnQueryMerge, fnClose} = reference.props;
    Ux.E.fxTerminal(!form, 10020, form);
    form.validateFieldsAndScroll((error, values) => {
        if (error) {
            return;
        }
        const {connector = "AND", ...rest} = values;
        const submitValues = {};
        submitValues[""] = "AND" === connector;
        Ux.itObject(rest, (field, value) => {
            if (undefined === value) {
                submitValues[field] = "__DELETE__"
            } else {
                submitValues[field] = value;
            }
        });
        if (U.isFunction(fnQueryMerge)) {
            fnQueryMerge(submitValues);
        }
        if (U.isFunction(fnClose)) {
            fnClose();
        }
    });
};
export default {
    irExClear,
    irExFilter,
}