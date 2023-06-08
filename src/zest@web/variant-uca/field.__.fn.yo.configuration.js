import __Zn from './zero.uca.func.dependency';
import {_Ant} from 'zo';

const Cv = __Zn.Env;

const yoFilterOption = (inputText, option) => {
    const {props = {}} = option;
    // 先做 value 匹配
    const {value, children} = props;
    if (0 <= value.indexOf(inputText)) {
        return true;
    } else {
        return (0 <= children.indexOf(inputText))
    }
}

const yoNormalize = (reference, jsx, onChange) => {
    // 解决 rest 为 {} 时引起的 Bug
    let rest = {};
    Object.keys(jsx).filter(key => ![
        "config",   // optionJsx.config
        "depend",  // optionJsx.depend
        "filter",    // optionJsx.filter
        // 下边是注入类配置
        "eventPrevent",
        "eventDisabled",
        "options",   // 后入参数
    ].includes(key))
        .forEach(key => rest[key] = jsx[key]);
    rest = __Zn.clone(rest); // 拷贝防止二次
    /*
     * 1）onChange 事件的处理（先构造配置项）
     */
    const {
        config,                  // 基本项配置：optionJsx.config
        depend,                 // 触发项配置：optionJsx.depend
        eventPrevent = true,     // 行为项配置：（编程传入）
        eventDisabled = false,   // ReadOnly的时候是否禁用（用于特殊配置）
        options = [],            // options，用于后期处理
    } = jsx;
    const $config = {
        reference,                      // 组件引用
        prevent: eventPrevent,          // 特殊配置
        options,                        // 处理 options 专用
    };
    if (config) {
        $config.config = __Zn.clone(config);      // 当前 Jsx 核心配置
    }
    if (depend) {
        $config.depend = __Zn.clone(depend);    // 当前 depend 配置
    }
    /*
     * 往 rest 中注入特殊的 onChange
     */
    _Ant.onChange(rest, onChange, $config);

    /*
     * 2）ReadOnly处理
     * 注意第二参数，该参数用于让组件在 readOnly 的时候同步 disabled 禁用组件
     * 如果组件不是 Input 的时候必须
     */
    _Ant.onReadOnly(rest, eventDisabled, reference);
    return rest;    // 返回构造好的 rest
}

const yoInitial = (rest, source = {}, reference) => {
    const initial = source[Cv.K_NAME._DATA_INITIAL];
    if (initial) {
        if (__Zn.isArray(initial)) {
            const {form} = reference.props;
            // form 变量专用处理
            if (!form) {
                rest.defaultValue = initial;
            }
        }
    }
}

const yoCssAdjust = (jsx, type = "") => {
    const clsRo = `ux-ro-${type}`;
    const clsDis = `ux-dis-${type}`;
    if (jsx.disabled) {
        if (jsx.className) {
            jsx.className = `${jsx.className} ${clsDis}`;
        } else {
            jsx.className = clsDis;
        }
    } else {
        if (jsx.readOnly) {
            if (jsx.className) {
                jsx.className = `${jsx.className} ${clsRo}`;
            } else {
                jsx.className = clsRo;
            }
        }
    }
}
const yoPropWith = (reference) => {
    // yoUniform -> onUniform
    const inherits = __Zn.onUniform(reference.props);
    const assistData = __Zn.yoAide(reference);
    return {
        ...inherits,
        ...assistData
    }
}
const yoInput = (reference, jsx, onChange) => {
    jsx = __Zn.clone(jsx);
    // 处理prefix属性
    _Ant.onPrefix(jsx);
    // 处理addonAfter
    _Ant.onAddonAfter(jsx);
    // onChange处理
    const {config = {}, depend} = jsx;
    _Ant.onChange(jsx, onChange, {
        reference,
        depend,
        config,
    });
    // ReadOnly处理
    _Ant.onReadOnly(jsx, false, reference);
    // 处理PlaceHolder，先处理readOnly
    _Ant.onPlaceHolder(jsx);
    return jsx;
}
export default {
    yoFilterOption,
    yoNormalize,
    yoInitial,
    yoCssAdjust,
    yoPropWith,

    yoInput,
}