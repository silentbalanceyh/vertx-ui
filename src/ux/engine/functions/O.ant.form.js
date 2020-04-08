import Dt from '../datum';
import U from "underscore";

/**
 * ## 引擎函数
 *
 * `formReset`的强化版本，内部可调用`doReset`方法。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String[]} keys 被重设的表单字段。
 */
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