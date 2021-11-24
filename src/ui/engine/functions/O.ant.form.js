import Dt from '../datum';
import U from "underscore";

/**
 * ## 「引擎」`Ux.formAdvReset`
 *
 * ### 1.基本介绍
 *
 * `formReset`的强化版本，内部可调用`doReset`方法，核心功能如下：
 *
 * 1. 当前 `reference` 中绑定了 Ant Design 的 form，执行当前表单的重置。
 * 2. 如果当前 `reference` 中没有父项，则递归往上执行，一直调用父类表单重置。
 * 3. 在重置时有两种支持模式
 *      * 直接重置（不选择任何字段直接重置）
 *      * 带字段重置（传入字段信息实现带字段的重置）
 * 4. 如果系统内部带有`doReset`方法，则执行该函数
 *
 * @memberOf module:_ui
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} response 响应最终信息数据。
 * @param {String[]} keys 被重设的表单字段。
 */
const formAdvReset = (reference, response = {}, keys = []) => {
    const {form} = reference.props;
    if (form) {
        /* 上级 */
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
        }
        const {doReset} = reference.props;
        if (U.isFunction(doReset)) {
            doReset(response, reference, keys);
        }
    } else {
        const ref = Dt.onReference(reference, 1);
        if (ref) {
            formAdvReset(ref, response, keys)
        }
    }
};

export default {
    formAdvReset
}