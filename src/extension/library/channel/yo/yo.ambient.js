import Ux from 'ux';
import Fn from '../../functions';
import U from 'underscore';

const _seekState = (uniform = {}, reference, key) => {
    /*
     * 先在属性中查询（属性优先）
     */
    let value = reference.props[key];
    if (value) {
        uniform[key] = value;
    } else {
        value = reference.state ? reference.state[key] : null;
        if (value) {
            uniform[key] = value;
        }
    }
};

const _seekSelected = (uniform = {}, reference, key) => {
    /*
     * 属性中包含就处理
     */
    let value = reference.props[key];
    if (value) {
        uniform[key] = value;
    }
};

const _seekAssist = (uniform = {}, input = {}) => {
    /*
     * props
     */
    if (input) {
        Object.keys(input)
            .filter(field => field.startsWith(`$a_`))
            .forEach(key => uniform[key] = input[key]);
    }
};

const _seekOption = (uniform = {}, reference) => {
    /*
    * 选项合并处理
    * reference.props -> $options
    * reference.state -> $options
    * 合并到一起，state 中的 $options 优先
    * 最后 $hoc 部分
    */
    let optionData = uniform.$options ? Ux.clone(uniform.$options) : {};
    const {$options = {}} = reference.state ? reference.state : {};
    Object.assign(optionData, $options);
    /*
     * $hoc 存在的时候才读取 module
     */
    const {$hoc} = reference.state ? reference.state : {};
    if ($hoc) {
        let module = Ux.fromHoc(reference, "module");
        if (!module) module = {};
        if (module.$options) {
            Object.assign(optionData, module.$options);
        }
    }
    uniform.$options = optionData;
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
    const uniform = Ux.onUniform(props,
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
        _seekSelected(uniform, reference, "$selected");
    }
    /*
     * 函数处理
     */
    Object.keys(props)
        .filter(propKey => !!propKey)
        .filter(propKey => U.isFunction(props[propKey]))
        .filter(Fn.isExFun)
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
    {
        /*
         * 开合状态处理
         */
        const {$collapsed = false} = reference.props;
        uniform.$collapsed = $collapsed;
    }
    {
        /*
         * $options 选择
         */
        _seekOption(uniform, reference);
    }
    Object.assign(uniform.config, config);
    /*
     * Assist数据专用
     */
    _seekAssist(uniform, reference.props);
    _seekAssist(uniform, reference.state);
    const {rxAssist} = reference.props;
    if (U.isFunction(rxAssist)) {
        uniform.rxAssist = rxAssist;
    }
    /*
     * 动态 $opKey
     */
    let {$opKey} = reference.props;
    if ($opKey) {
        uniform.$opKey = $opKey;
    } else {
        /*
         * 有状态才做二次读取
         */
        if (reference.state) {
            $opKey = reference.state.$opKey;
            if ($opKey) {
                uniform.$opKey = $opKey;
            }
        }
    }
    /*
     * options 专用处理
     */
    Object.freeze(uniform.config);          // 锁定配置，不可在子组件中执行变更
    return uniform;
};