import __Zn from './zero.module.dependency';
import __AJX from './lighting.fn.ajax.uca';

const Cv = __Zn.Env;
const xtDiff = (left, right) => {
    const leftType = typeof left;
    const rightType = typeof right;
    if (leftType === rightType) {
        // 相同类型才能比较
        if (__Zn.isArray(left) || __Zn.isObject(left)) {
            return __Zn.isDiff(left, right);
        } else {
            return left !== right;
        }
    } else {
        // 类型不同则二者不同
        return true;
    }
};
const xtValue = (reference, consumer) => {
    const {config = {}} = reference.props;
    const originalFormat = config.format ? config.format : Cv.XT_FORMAT.OBJECT;
    const state = reference.state ? __Zn.clone(reference.state) : {};
    let data = state.data;
    /* 计算简单format */
    let hitFormat;
    if ("string" === typeof originalFormat) {
        hitFormat = originalFormat;
    } else {
        const {type} = originalFormat;
        hitFormat = type ? type : Cv.XT_FORMAT.OBJECT;
    }
    // Dev.dgDebug({format: hitFormat}, "自定义组件选择数据格式")
    if (Cv.XT_FORMAT.OBJECT === hitFormat) {
        if (__Zn.isArray(data) || undefined === data) {
            throw new Error("格式和数据异常，状态格式：Array，定义格式：Object。");
        } else {
            return consumer.object(data);
        }
    } else if (Cv.XT_FORMAT.ARRAY === hitFormat) {
        if (__Zn.isArray(data) || undefined === data) {
            return consumer.array(data);
        } else {
            throw new Error("格式和数据异常，状态格式：Object，定义格式：Array。");
        }
    } else if (Cv.XT_FORMAT.ARRAY_PURE === hitFormat) {
        return consumer.arrayPure(data);
    } else if (Cv.XT_FORMAT.ARRAY_MAP === hitFormat) {
        /* 两种格式都支持 */
        return consumer.arrayMap(data);
    } else if (Cv.XT_FORMAT.ARRAY_GROUP === hitFormat) {

    }
}
const xtTableLazy = (reference, state, $data = {}) => new Promise((resolve) => {
    const {table = {}} = reference.state;
    if (table && table.columns) {
        __AJX.ajaxEager(reference, table.columns, __Zn.valueArray($data))
            .then($lazy => __Zn.promise(state, "$lazy", $lazy))
            .then(done => resolve(done))
    } else {
        resolve(state);
    }
})
export default {
    xtValue,
    xtDiff,
    xtTableLazy,
}