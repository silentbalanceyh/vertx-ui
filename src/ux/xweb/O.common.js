import Cv from "../constant";
import Abs from '../abyss';

/**
 * ## 标准函数
 *
 * 新版中的`UNSAFE_componentWillReceiveProps(nextProps,context)`的内部调用，虽然不提倡使用，
 * 但在自定义组件中，该函数依然会控制内部状态变更，所以依旧采用该方法。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Props} nextProps 下一个属性。
 */
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};

const xtValue = (reference, consumer) => {
    const {config = {}} = reference.props;
    const {format = Cv.XT_FORMAT.OBJECT} = config;
    const state = reference.state ? Abs.clone(reference.state) : {};
    let data = state.data;
    if (Cv.XT_FORMAT.OBJECT === format) {
        if (Abs.isArray(data)) {
            throw new Error("格式和数据异常，状态格式：Array，定义格式：Object。");
        } else {
            return consumer.object(data);
        }
    } else if (Cv.XT_FORMAT.ARRAY === format) {
        if (Abs.isArray(data)) {
            return consumer.array(data);
        } else {
            throw new Error("格式和数据异常，状态格式：Object，定义格式：Array。");
        }
    } else if (Cv.XT_FORMAT.SET === format) {
        return consumer.set(data);
    }
}
/**
 * ## 标准函数
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {String} field 读取字段的数据（只适用于OBJECT类型）。
 * @return {Object} 返回最终状态信息。
 */
const xtGet = (reference, field) => {
    return xtValue(reference, {
        object: (data) => {
            if (data) {
                return field ? data[field] : data;
            } else return data;
        },
        array: (data) => field ? data
            .filter(Abs.isObject)
            .map(item => item[field]) : data,
        set: (data) => data ? data : []
    })
};
/**
 * ## 标准函数
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Array} name 读取字段的数据（只适用于OBJECT类型）。
 * @param {any} value 设置的任何值。
 * @return {Object} 返回最终状态信息。
 */
const xtSet = (reference, name, value) => {
    let field;
    let index = -1;
    if ("string" === typeof name) {
        field = name;
    } else if (Abs.isArray(name)) {
        field = name[0];
        index = undefined !== name[1] ? name[1] : -1;
    } else if ("number" === typeof name) {
        index = name;
    }
    return xtValue(reference, {
        object: data => {
            if (data) {
                data[field] = value;
            }
            return data;
        },
        array: data => {
            const ref = data[index] ? data[index] : null;
            if (ref) {
                ref[field] = value;
            }
            return data;
        },
        set: data => {
            data[index] = value;
            return data;
        }
    })
};
export default {
    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
    xtSet,
};