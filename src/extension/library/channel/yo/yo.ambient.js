import Ux from 'ux';
import Fn from '../../functions';
import U from 'underscore';
import yoOption from './yo.option';

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
            .filter(field => field.startsWith(`$a_`) ||
                field.startsWith(`__`)) // 新组件继承
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
/**
 * ## 扩展函数
 *
 * 计算继承属性（统一继承属性专用处理），统一继承的属性：
 *
 * 1. 基本属性：
 *      * $app：应用数据，DataObject
 *      * $user：登录用户数据，Object
 *      * $router：路由数据，DataRouter
 *      * $menus：菜单专用数据，DataObject
 *      * $profile: 登录用户Profile信息
 *      * $submitting：redux防重复提交专用
 * 2. 标识符专用属性，读取属性中的 $identifier 模型标识符。
 * 3. options 配置数据读取：
 *      * 状态 state 中的 `options` 读取
 *      * 属性 props 中的 `$options` 读取
 *      * 最终排序，优先使用 props 中的 $options
 * 4. 特殊禁用变量：$disabled 属性。
 * 5. 提交状态变量
 *      * $submitting：正在提交
 *      * $loading：正在加载
 *      * $dirty：脏数据
 * 6. 选中项：$selected
 * 7. 函数处理，继承函数前缀：`rx, do, fn`。
 * 8. 特殊引用
 *      * reference：父引用
 *      * react：根引用
 * 9. 插件配置
 *      * $plugins：插件继承
 * 10. 选项`$options`处理
 * 11. 编程配置 config 合并到 `uniform.config`中形成最终配置。
 * 12. Assist数据提取，从 props 和 state 中提取，之后处理 rxAssist 中部函数。
 * 13. 动态操作符：`$opKey` 注入
 * 14. 附加配置：`$record` 专用处理
 *      * 外层变量是单变量，用于记录拷贝
 *      * 如果是数组，必定会在 Form 中选择方式，那可直接走 Assist
 * 15. 配置处理完过后冻结，调用：`freeze`
 *
 * @memberOf module:_channel
 * @method yoAmbient
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} config 额外的配置数据
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
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
    );
    {
        const {$identifier} = reference.props;
        if ($identifier) {
            uniform.$identifier = $identifier;
        }
    }
    uniform.$options = yoOption(reference);
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
        .filter(Fn.mapFun)
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
        const {$collapsed = false, $plugins = {}} = reference.props;
        uniform.$collapsed = $collapsed;
        if (!Ux.isEmpty($plugins)) {
            uniform.$plugins = $plugins;
        }
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
    let {$opKey, $record} = reference.props;
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
     * 添加的时候需要使用初始化的默认值
     * 所以引入外层变量 $record 来存储
     * 1）外层变量是单变量，主要用于记录拷贝
     * 2）如果是一个数组，必定会在Form中使用选择的方式，那么可以直接走 Assist
     */
    if ($record) {
        uniform.$record = $record;
    }
    Object.freeze(uniform.config);          // 锁定配置，不可在子组件中执行变更
    return uniform;
};