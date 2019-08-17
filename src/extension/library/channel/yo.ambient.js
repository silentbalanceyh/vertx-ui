import Ux from 'ux';
import Fn from '../functions';
import U from 'underscore';

const _seekState = (uniform = {}, reference, key) => {
    /*
     * 先在属性中查询（属性优先）
     */
    let value = reference.props[key];
    if (value) {
        uniform[key] = value;
    } else {
        const state = Fn.state(reference);
        value = state[key];
        if (value) {
            uniform[key] = value;
        }
    }
};

const _seekOptional = (uniform = {}, reference, key) => {
    /*
     * 属性中包含就处理
     */
    let value = reference.props[key];
    if (value) {
        uniform[key] = value;
    }
};

export default (reference = {}, config = {}) => {
    const props = reference.props;
    /*
     * $app
     * $user
     * $profile：保留属性
     * $router
     * $menus
     * */
    const uniform = Ux.toUniform(props,
        "app", "user", "router",
        "menus",
        "hotel",     // 旧系统专用
        "options",   // 选项专用
    );
    /*
     * 特殊变量
     * $disabled
     */
    const {$disabled = false} = props;
    if ($disabled) {
        /* 只接收 $disabled = true */
        uniform.$disabled = $disabled;
    }
    {
        /*
         * 状态检索：
         * $submitting：正在提交
         * $loading：正在加载
         * $dirty：脏数据
         */
        _seekState(uniform, reference, "$submitting");
        /*
         * 特殊变量：
         * （主要用于配置无法处理继承的情况）
         * $selected：选中项
         */
        _seekOptional(uniform, reference, "$selected");
    }
    /*
     * 函数处理
     */
    Object.keys(props)
        .filter(propKey => !!propKey)
        .filter(propKey => U.isFunction(props[propKey]))
        .filter(Fn.specFun)
        .forEach(propKey => uniform[propKey] = props[propKey]);
    /*
     * 特殊引用
     * reference：父引用
     * referenceRoot: 根引用
     */
    uniform.reference = reference;
    if (props.reference) {
        uniform.react = props.reference;
    } else {
        uniform.react = reference;
    }
    if (!uniform.config) uniform.config = {};
    Object.assign(uniform.config, config);
    Object.freeze(uniform.config);          // 锁定配置，不可在子组件中执行变更
    return uniform;
};