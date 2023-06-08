// 高阶函数
import __Zn from './zero.module.dependency';

export default (values = {}, configuration = {}) => (render) => {
    const {
        reference,
        cell,
        event = __Zn.Env.TYPE_ON.ON_CHANGE,
    } = configuration;
    // 旧代码
    // return (render) => __raftEvent(reference, {
    //     ...cell,
    //     optionJsx
    // }, render, Cv.TYPE_ON.ON_CHANGE);
    const keyState = `$${event}`;
    let defined = reference.state ? reference.state[keyState] : {};
    if (!defined) defined = {};

    /* 生成 fnChange */
    const {field, optionJsx, column = {}} = cell;

    /* 处理 $field 问题 */
    let $field;
    if (undefined !== column.index) {
        $field = [field, column.index];
    } else {
        $field = field;
    }

    /* 事件挂载 */
    let fnEvent;
    if (__Zn.isFunction(defined[field])) {
        /* 定义了特殊函数的 */
        fnEvent = event => defined[field](event, optionJsx);
    } else {
        const {id} = reference.props;
        fnEvent = event => {
            const value = __Zn.ambEvent(event);
            if (id === field) {
                /* 当前字段直接处理 */
                __Zn.fn(reference)[event](value);
            } else {
                /* 读取核心字段 */
                const merged = __Zn.xtSet(reference, $field, value);
                __Zn.of(reference).in({
                    data: merged
                }).handle(() => {

                    /* 读取更新值 */
                    const updated = __Zn.xtFormat(merged, column.format);
                    __Zn.fn(reference)[event](updated);
                })
                // reference.?etState({data: merged});
                // /* 读取更新值 */
                // const updated = __Zn.xtFormat(merged, column.format);
                // __Zn.fn(reference)[name](updated);
            }
        }
    }
    const {value = {}} = reference.props; // 由于是自定义控件，这个值一定是必须的
    /* 计算最终值 */
    if (__Zn.isArray(value)) {
        if (__Zn.isArray($field)) {
            const [targetField, targetIndex] = $field;
            if (targetField && undefined !== targetIndex) {
                const row = value[targetIndex];
                if (row) {
                    optionJsx.value = row[targetField];
                }
            }
        }
    } else {
        if ("string" === typeof $field) {
            optionJsx.value = value[field];       // 值绑定
        }
    }
    return render(reference, optionJsx, fnEvent);
}