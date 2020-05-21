import Abs from '../../abyss';
import Value from "../../element";
import Xt from "../../xweb";

const _mountEvent = (reference, cell = {}, render, name) => {
    const stateKey = `$${name}`;
    let defined = reference.state ? reference.state[stateKey] : {};
    if (!defined) defined = {};
    /* 生成 fnChange */
    const {field, optionJsx} = cell;
    let fnEvent;
    if (Abs.isFunction(defined[field])) {
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
                const merged = Xt.xtSet(reference, field, value);
                reference.setState({data: merged});
                Abs.fn(reference)[name](merged);
            }
        }
    }
    const {value = {}} = reference.props; // 由于是自定义控件，这个值一定是必须的
    optionJsx.value = value[field];       // 值绑定
    return render(reference, optionJsx, fnEvent);
}
export default {
    aiOn: (render) => ({
        onChange: (reference, jsx) => _mountEvent(reference, jsx, render, "onChange")
    })
}