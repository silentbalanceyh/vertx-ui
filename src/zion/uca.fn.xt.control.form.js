import __Zn from './zero.module.dependency';
import __V from './uca.__.fn.xt.process';

const xtReset = (reference, virtualRef = {}, callback) => {
    /*
     * 三个值相互比较
     */
    const current = reference.props.value;
    const original = virtualRef.props.value;
    let isTouch;
    //更新
    const {form} = reference.props;
    if (form) {
        isTouch = form.isFieldsTouched();
    } else {
        isTouch = false;
    }
    if (!isTouch) {
        /*
         * 这是标准自定义控件中会存在的内容
         */
        if (reference.props.hasOwnProperty(__Zn.Env.K_NAME.$DATA_META)) {
            const metadata = reference.props[__Zn.Env.K_NAME.$DATA_META];
            const initial = metadata.initialValue;
            if (__V.xtDiff(current, original) && !__V.xtDiff(current, initial)) {
                callback(initial);
            }
        }
    }
};

const __xtRevert = (reference, callback = {}) => {
    /*
     * prevValue（之前的值）
     * curValue（之后的值）
     */
    const ref = __Zn.onReference(reference, 1);
    if (ref) {

        /*
         * 传入了 reference 变量
         */
        //更新
        const {form} =  reference.props;
        if (form) {
            const isTouched = form.isFieldsTouched();
            const {value, onChange} = reference.props;
            if (isTouched) {
                console.debug("ANT-FORM, touched = true");
            } else {
                console.debug("ANT-FORM, touched = false");
                /*
                 * 重置
                 */
                if (__Zn.isFunction(onChange)) {
                    onChange(value);
                    /*
                     * 外置函数
                     */
                    if (__Zn.isFunction(callback.reset)) {
                        callback.reset(value);
                    }
                }
            }
        } else {
            console.debug("NO-FORM");
            /*
             * 非直接自定义控件
             */
        }
    } else {
        /*
         * 没有传入 reference 变量
         */
        console.debug("NO-REF, reference = null");
    }
}
const xtRevert = (reference, virtualRef, callback = {}) => {
    const {readOnly = false} = reference.props;
    if (!readOnly) {
        const prevValue = virtualRef.props.value;
        const curValue = reference.props.value;
        if (__Zn.isObject(prevValue) || __Zn.isObject(curValue)) {
            /*
             * 数据结构是 Object 或 Array
             */
            if (__V.xtDiff(prevValue, curValue)) {
                __xtRevert(reference, callback);
            }
        } else {
            if (prevValue !== curValue) {
                __xtRevert(reference, callback);
            }
        }
    } else {
        /**
         * ReadOnly 的情况下，不执行任何重置，因为不会被改变
         */
    }
}
export default {
    xtReset,
    xtRevert,
}
