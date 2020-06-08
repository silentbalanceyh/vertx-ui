import Abs from '../../abyss';
import Value from "../../element";
import Xt from "../../xweb";

const _mountEvent = (reference, cell = {}, render, name) => {
    const stateKey = `$${name}`;
    let defined = reference.state ? reference.state[stateKey] : {};
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
    if (Abs.isFunction(defined[field])) {
        /* 定义了特殊函数的 */
        fnEvent = event => defined[field](event, optionJsx);
    } else {
        const {id} = reference.props;
        fnEvent = event => {
            const value = Value.ambEvent(event);
            if (id === field) {
                /* 当前字段直接处理 */
                Abs.fn(reference)[name](value);
            } else {
                /* 读取核心字段 */
                const merged = Xt.xtSet(reference, $field, value);
                reference.setState({data: merged});
                /* 读取更新值 */
                const updated = Xt.xtFormat(merged, column.format);
                Abs.fn(reference)[name](Xt.xtFormat(merged, column.format));
            }
        }
    }
    const {value = {}} = reference.props; // 由于是自定义控件，这个值一定是必须的
    /* 计算最终值 */
    if (Abs.isArray(value)) {
        if (Abs.isArray($field)) {
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
export default {
    aiOn: (render) => ({
        onChange: (reference, jsx) => _mountEvent(reference, jsx, render, "onChange")
    })
}