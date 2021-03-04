/*
 * -------------> Component规范
 * 「一个组件传入到另外一个组件的基本规范参考此文件」：
 * 注意连接的生命周期位置：
 * 1）`yo`打头的
 *    说明：yo 打头的函数用于外置组件连接内置组件，写法自由，传入参数为
 *    (reference, addOn)
 *       - reference 是外置组件引用
 *       - addOn 是外置组件需要传入给内置组件的属性值
 * 1.1）传入统一说明（目前出现的）：
 * {
 *      $app: DataObject - 应用程序配置：X_APP 表内容,
 *      $router：DataRouter - (react-router）构造对象，保存了路由处理,
 *      $menus：DataArray - X_MENU 菜单数据信息，
 *      $user：DataObject - 登录用户基本数据信息,
 *      $inited：Object - Form专用初始化数据（外置传入）
 *      config：{
 *          配置数据，按 Component 处理自由度（不同组件配置信息有所区别）
 *      },
 *      data：[
 *          核心数据，按 Component 需求处理
 *      ],
 *      fnOut：redux 专用公共写数据,
 *      css：{
 *          `cls`打头，专用于Css中的 className 处理
 *      }
 * }
 * `yo`组件以目标组件需求格式为主，上述格式是最终的子组件的 props
 * Form表单专用
 * 1.2）列表：
 * - yoSider：ExSider
 * - yoNavigation: Ex
 *
 * Component规范 -------------->
 * 2）`yi`打头的
 *    说明：yi 打头的函数用于内置函数初始化专用，传入内容统一
 *    (reference)
 *       - reference 是内置组件引用
 *    `yi`会将内置组件 reference 解开，然后生成状态信息：state 并且设置到当前组件
 *    不同组件内置状态结构会有所区别
 *
 * Initialize规范 ------------->
 * 3）`yl`打头的
 *    说明：yl 打头的函数主要用于初始化操作
 *
 * yo - 哟，origin
 * yi - 嗨，hi - initialize
 * yc - 配，config
 * yx - yxRender -> 切换 render 处理
 *
 * 动态 Control
 *
 * 按钮专用过滤函数，主要过滤几种：
 * 1）Open区
 * 2）Batch区
 * 3）Search区
 * 4）Extra区
 * 5）Row区
 *
 * 几个特定函数
 * -- yoList -> 列表区域
 * -- yoTab -> Tab页
 * -- yoForm -> 表单区域
 * -- yoTable -> 列表区域
 */
import Ux from "ux";
import Fn from "../functions";
import {LoadingContent} from "web";
import React from "react";

const Order = {
    "op.open": [
        "op.open.add",
        "op.open.filter"
    ],
    "op.batch": [
        "op.batch.edit",
        "op.batch.delete"
    ],
    "op.extra": [
        "op.extra.column",
        "op.extra.export",
        "op.extra.import"
    ],
    "op.add": [
        "op.submit.add",
        "op.submit.reset"
    ],
    "op.edit": [
        "op.submit.save",
        "op.submit.delete",
        "op.submit.reset"
    ]
}
const rxClose = (reference, item = {}, isAdd = true) => (data = {}, addOn = {}) => {
    const {options = {}} = reference.state;
    if (!data.key) {
        console.error("[ Ex ] 传入数据没有 key，tab 操作会失败，请检查数据：", data);
    }
    if (options[Fn.Opt.DYNAMIC_SWITCH] && isAdd) {
        Fn.rxTabEdit(reference)(data.key, data, item, {
            $submitting: false,
            ...addOn
        });
    } else {
        Fn.rxTabClose(reference)(data.key, {
            $dirty: true,
            $submitting: false,
            ...addOn
        });
    }
    return Ux.promise(data);
};

const yoOption = (reference) => {
    const {options = {}} = reference.state ? reference.state : {};
    let stateOpt = Ux.clone(options);
    const {$options = {}} = reference.props ? reference.props : {};
    if (!Ux.isEmpty($options)) {
        /*
         * 如果 $options 中存在 identifier
         * 那么该操作会覆盖掉 identifier
         */
        Object.assign(stateOpt, $options);
    }
    return Ux.sorterObject(stateOpt);
}
const yoBatchEditor = (batch, reference) => {
    const {config = []} = batch;
    const buttonRef = config.filter(item => "op.batch.edit" === item.category)[0];
    if (buttonRef) {
        /*
         * 抽取列信息
         */
        const {$columns = [], $columnsMy = []} = reference.state;

        /*
         * 抽取配置信息，直接从引用入手，需要修改引用
         */
        const {component = {}} = buttonRef;
        const editorRef = component.config;

        /*
         * 计算最新的配置
         * ExBatchEditor 中的配置必须存在于 columns 中
         * 1）检查是否全部存在于 columns
         * 2）如果不存在于 columns 中，则想办法移除
         * 直接加入 rxFilter 方法，让内置可以直接过滤
         */
        editorRef.$columns = $columns;
        editorRef.$columnsMy = $columnsMy;
    }
    return batch;
}
const yoFormPlugin = (addOn = {}, reference) => {
    /*
     * addOn.form 基本内容
     * 编程传入专用
     */
    const program = Ux.clone(addOn.form);
    /*
     * 输入专用处理：
     * 1）addOn.form：通过编程部分拿到的 form 信息
     * 2）S0（前端静态文件）_form：前端静态配置（主配置）——通常静态form使用此配置
     * 3）S1（前端静态文件）_formUp：前端静态配置（辅助配置）
     * 4）S2（前端静态文件）_formDown：前端静态配置（辅助配置）
     * 5）D0（后端处理）form：后端主配置
     * 6）D1（后端处理）formDown：后端主配置
     * 7）D2（后端处理）formUp：后端主配置
     * 布局专用处理
     * 1）（S0）标准前端静态
     * 2）（S0 + D0）：前端静态 + 后端主配置
     * 3）（S1 + S0/D0 + S2）：静态 + 动/静 + 静态
     */
    const sForm = Ux.fromHoc(reference, "form");
    const sFormUp = Ux.fromHoc(reference, "formUp");
    const sFormDown = Ux.fromHoc(reference, "formDown");
    /*
     * 合并处理函数，主要处理合并
     */
    const {$options = {}} = reference.props;
    let form = {}, formUp = {}, formDown = {};
    if (!Ux.isEmpty($options)) {
        /*
         * 抽取 $options 中的后端配置
         */
        form = $options.form;
        formUp = $options['formUp'];
        formDown = $options['formDown'];
    }
    /*
     * 最终合并
     * 按顺序合并表单处理
     * [
     *     program,
     *     sFormUp, formUp,
     *     sForm, form,         // 主单据（常用）
     *     sFormDown, formDown
     * ]
     */
    let normalized = {};
    [
        program,
        sFormUp, formUp,
        sForm, form,
        sFormDown, formDown
    ]
        .filter(item => !!item)
        .filter(Ux.isObject)
        .forEach(form => normalized = Ux.toForm(normalized, form));
    /*
     * normalized 的最终处理
     */
    return normalized;
}
/*
 * op.extension 部分的执行
 *
 * 区域执行
 * prefix 参数
 *
 * - 打开区域：op.open
 * - 批量区域：op.batch
 * - 额外区域：op.extra
 * - 搜索区域：op.search
 * - Tab页区域：op.tab
 * - 列 Row 的区域：op.row
 */
const yoExtension = (reference, prefix, actions = []) => {
    const source = Ux.clone(actions);
    const {op = {}} = reference.state;
    const {rxExtension = () => true} = reference.props;
    const targets = Object.keys(op)
        .filter(key => key.startsWith("op.extension"))
        .filter(key => !!op[key])
        .filter(key => !!op[key].region)
        .filter(key => op[key].region.startsWith(prefix))
        /* 默认直接返回 true，表示所有的条件都符合 */
        .filter(key => rxExtension(op[key], reference))
        .map(key => {
            const normalized = op[key];
            normalized.key = op[key].region;
            return normalized;
        });
    /*
     * 修改 source 最终返回
     * 如果没有 index，则元素追加到后边
     * 基本算法：
     * source = [0,1,2,3]
     * targets 分成两部分，带 index 的，不带 index 的
     */
    const fnIndex = (item = {}) => {
        const {config} = item;
        return config && config.hasOwnProperty('index')
    }
    const tail = targets
        .filter(item => !fnIndex(item));
    const inserted = targets
        .filter(item => fnIndex(item))
        .sort((left, right) => left.config.index - right.config.index);
    let append = [];

    if (0 < inserted.length) {
        const found = inserted[inserted.length - 1];
        const maxIndex = found.config.index;
        source.reverse();
        /*
         * 补充 inserted
         * [1,3] -> [undefined, 1, undefined, 3]
         */
        const filled = [];
        for (let idx = 0; idx <= maxIndex; idx++) {
            const found = inserted.filter(item => idx === item.config.index);
            if (found[0]) {
                filled.push(found[0]);
            } else {
                filled.push(null);
            }
        }
        /*
         * 填充 null 替换成 source 中的值
         */
        filled.forEach((fill) => {
            if (fill) {
                append.push(fill);
            } else {
                if (0 < source.length) {
                    append.push(source.pop())
                }
            }
        });
        /*
         * source 结束的
         */
        if (0 < source.length) {
            source.forEach(item => append.push(item))
        }
        append = append.filter(item => !!item);
    } else {
        // 没有 inserted
        append = [].concat(source).concat(tail);
    }
    return append;
}

const _seekForm = (reference, addOn = {}) => {
    if (!addOn) addOn = {};
    let {dialog, modal, form} = addOn;
    if (!dialog) {
        dialog = Ux.fromHoc(reference, "dialog");
    }
    if (!modal) {
        modal = Ux.fromHoc(reference, "modal");
    }
    const assist = Ux.fromHoc(reference, "assist");
    const state = {dialog, modal, form};
    if (assist) {
        state.assist = Ux.clone(assist);
    }
    return state;
};
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
const _seekComponent = (attrs = {}, control = {}) => {
    const {
        componentConfig = {},
        componentData = "",
        componentName = "",
    } = control;
    attrs.config = Ux.clone(componentConfig);
    attrs.source = componentData;
    attrs.key = control.key;
    attrs.pageId = control['pageId'];
    attrs.name = componentName;
};
const _seekContainer = (attrs = {}, control = {}, componentType) => {
    const {containerConfig, containerName} = control;
    if (containerName) {
        // attrs.name = containerName;
        // 名字只可以有一个，否则会出现 container 覆盖 component 原始的名字导致渲染不正常
        attrs.container = {
            name: containerName,
            config: containerConfig ? containerConfig : {},
            // For $metadata generation
            key: control.key,
            pageId: control['pageId'],
            componentType,
        };
    }
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
const yoAmbient = (reference = {}, config = {}) => {
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
        .filter(propKey => Ux.isFunction(props[propKey]))
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
    if (Ux.isFunction(rxAssist)) {
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
     * 3）外层变量同样会在 config 这个过程中引入特殊属性：rowData 用来设置选中记录
     */
    if ($record) {
        uniform.$record = $record;
    }
    Object.freeze(uniform.config);          // 锁定配置，不可在子组件中执行变更
    return uniform;
};


/**
 * ## 扩展函数
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，然后追加配置：
 *
 * 1. 追加 $identifier 统一标识符（这里是计算过后的标识符）
 * 2. 追加 $controls 控件配置信息
 * 3. 初始化数据 $inited 专用
 * 4. 专用配置 $mode 模式处理
 *
 * @memberOf module:_channel
 * @method yoDynamic
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoDynamic = (reference = {}) => {
    const attrs = yoAmbient(reference);
    const {
        $identifier, $controls = {}, $inited,
        $mode, $fabric = {}
    } = reference.props;
    if ($identifier) {
        /*
         * 动态选择模型专用标识符
         */
        attrs.$identifier = $identifier;
    }
    if (!Ux.isEmpty($controls)) {
        /*
         * 动态控件专用配置信息
         */
        attrs.$controls = $controls;
    }
    if ($inited) {
        /*
         * 表单专用初始化数据相关信息
         * 1）先走 state 中的 $inited
         * 2）再走 props 中的 $inited
         */
        let inited = reference.state ? reference.state.$inited : null;
        if (Ux.isEmpty(inited)) {
            attrs.$inited = $inited;
        } else {
            /*
             * 状态中的 inited，和 rxView 配合
             */
            const {rxView} = reference.props;
            if (Ux.isFunction(rxView)) {
                /* 动态处理 */
                attrs.rxView = (key) => rxView(key).then(data =>
                    reference.setState({$inited: data}));
            }
            attrs.$inited = inited;
        }
    }
    if ($mode) {
        /*
         * 表单专用信息
         */
        attrs.$mode = $mode;
    }
    if ($fabric) {
        /*
         * 状态处理
         */
        attrs.$fabric = $fabric;
    }
    return attrs;
}

/**
 * ## 扩展函数
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，之后追加：
 *
 * 1. 直接读取 fromHoc 中的 grid 配置
 * 2. 如果传入了专用表单配置，则处理 form 表单配置，填充 $form 变量
 * 3. state 中的 $query 读取
 * 4. state 中的 config.options 中读取 $identifier
 * 5. 构造 $inited 中的 $identifier
 *
 * @memberOf module:_channel
 * @method yoPolymorphism
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} form
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoPolymorphism = (reference = {}, {form}) => {
    const attrs = yoAmbient(reference);
    /*
     * 配置 config 相关信息构成多态，直接从 grid 中读
     */
    const config = Ux.fromHoc(reference, "grid");
    if (config) {
        /*
         * 通过拷贝检查最终的 config 发生改变
         * 这里必须使用拷贝以方便切换，如果不拷贝那么切换会导致最终的
         * 界面不刷新（动态切换必须在这里处理）
         */
        attrs.config = Ux.clone(config);
    }
    /*
     * 专用组件信息
     * 用于配置 $form 专用组件
     */
    if (form) {
        attrs.$form = form;
    }
    /*
     * $query 中的 this.state
     */
    const {$query = {}} = reference.state ? reference.state : {};
    attrs.$query = $query;
    /*
     * options = {}
     */
    const {options = {}} = config;
    if (options[Fn.Opt.IDENTIFIER]) {
        attrs.$identifier = options[Fn.Opt.IDENTIFIER];
    }
    return attrs;
}
/**
 * ## 扩展函数
 *
 * 输入配置的基本信息如（四大基本组件）：
 *
 * ```
 * {
 *     "type": "COMPONENT / LIST / FORM / CONTAINER"
 * }
 * ```
 *
 * @memberOf module:_channel
 * @method yoControl
 * @param {Object} control 控件原始配置。
 * @returns {Object} 返回动态处理中的控件专用配置。
 */
const yoControl = (control = {}) => {
    const attrs = {};
    const {type = "COMPONENT", sign = ""} = control;
    if (!sign || 64 !== sign.length) {
        // console.error("[ Ex ] 使用的 Ox 组件签名不合法，请检查签名信息！", sign, sign ? sign.length : null);
    }
    /*
     * 第一层解析，解析 component，这是必须的
     */
    const $component = Ux.immutable(["LIST", "FORM", "COMPONENT"]);
    if ("CONTAINER" === type) {
        /*
         * 容器配置，这种情况下，只有 container 节点，没有其他节点
         * component 节点没有
         */
        _seekContainer(attrs, control, type);
        if (!attrs.container) {
            throw new Error("[ Ex ] 由于 type = CONTAINER，必须包含 containerName！");
        }
        /* 表示只有 container 容器，不包含 component */
        attrs.isContainer = true;
    } else if ($component.contains(type)) {
        /*
         * LIST / COMPONENT / FORM
         * 容器（可选）
         * 注意顺序，这里需要
         * 1）先处理 container 级别的配置
         * 2）再处理 component 级别的配置，最终这里需要执行覆盖
         */
        _seekContainer(attrs, control, type);   // 加入 type 作为 component 类型
        _seekComponent(attrs, control);
    } else {
        throw new Error(`[ Ex ] 使用了不支持的类型：type = ${type}`);
    }
    return attrs;
}

/**
 * ## 扩展函数
 *
 * List 必须传入的配置
 *
 * 1. 外置：state -> query, 内置：props -> $query
 * 2. 这个会作为默认的 query 值传入，并且会和对应的判断形成呼应
 *
 *
 * @memberOf module:_channel
 * @method yoList
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoList = (reference) => {
    /*
     * 基本内容
     */
    const inherit = yoAmbient(reference);
    const {
        options = {},   // 当前状态中保存的 options 配置项
        $selected = [], // 内存选中项（多选时使用）
        // 清空时专用
        $condition = {},    // 外置条件保存
    } = reference.state;
    inherit.$query = Ux.qrInherit(reference);
    inherit.$selected = $selected;
    inherit.$options = options;
    inherit.$condition = $condition;    // 主要是为了维持状态专用
    /*
     * 二义性方法
     * rxSearch
     */
    inherit.rxSearch = Fn.rxSearch(reference);
    /*
     * 条件专用
     * rxCondition
     * rxClean
     */
    inherit.rxCondition = Fn.rxCondition(reference);
    /*
     * 打开新页面
     * rxOpen
     */
    inherit.rxOpen = Fn.rxTabOpen(reference);
    /*
     * 行专用
     * rxSelected
     * rxDeleted
     * rxView
     */
    inherit.rxSelected = Fn.rxSelected(reference);
    inherit.rxDelete = Fn.rxDelete(reference);
    inherit.rxView = Fn.rxView(reference);
    /*
     * 状态函数
     */
    inherit.doLoading = Fn.rxLoading(reference);
    inherit.doDirty = Fn.rxDirty(reference);
    /*
     * rxPostDelete处理
     */
    const {rxPostDelete} = reference.props;
    if (Ux.isFunction(rxPostDelete)) {
        inherit.rxPostDelete = rxPostDelete;
    }
    /*
     * rxPost系列
     */
    return inherit;
}
/**
 * ## 扩展函数
 *
 * 查询表单专用，构造查询信息，内置先调用`yoDynamic`处理。
 *
 * 1. 初始化表单值`$inited`，赋予`connector`的连接符。
 * 2. rxClose 的专用处理。
 *
 * @memberOf module:_channel
 * @method yoFilter
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoFilter = (reference) => {
    const attrs = yoDynamic(reference);
    /*
     * 初始化数据
     */
    const {$inited = {}} = reference.props;
    if (Ux.isEmpty($inited)) {
        attrs.$inited = {
            connector: "AND"
        };
    } else {
        const data = Ux.clone($inited);
        const connector = data[""] ? "AND" : "OR";
        delete data[""];
        data.connector = connector;
        attrs.$inited = data;
    }
    /*
     * 关闭专用函数
     */
    attrs.rxClose = Fn.rsVisible(reference, false);
    return attrs;
}

/**
 * ## 扩展函数
 *
 * 表单专用处理函数，前置调用 `yoAmbient`，处理内容：
 *
 * 1. form 基本配置处理
 * 2. assist 赋值数据处理
 * 3. control 控件配置
 *      magic：处理Ajax专用
 *      control：控件配置
 *      addon：处理AddOn
 * 4. dialog 窗口专用配置
 * 5. config 核心配置
 * 6. $inited 初始化数据
 * 7. 表单处理专用
 *      $identifier：统一标识符
 *      $mode：表单模式，ADD/EDIT
 *      $addKey：添加表单的组件
 *
 * @memberOf module:_channel
 * @method yoForm
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} additional 额外配置处理
 * @param {Object} data 数据记录相关信息
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoForm = (reference, additional = {}, data = {}) => {
    const addOn = _seekForm(reference, additional);
    const attrs = yoAmbient(reference);
    const config = {};
    config.form = yoFormPlugin(addOn, reference);
    if (addOn.assist) {
        config.assist = addOn.assist;
    }
    /*
    if (Ux.isObject(addOn.form)) {
        let form = addOn.form;
        const {$options} = reference.props;
        if ($options && $options.form) {
            form = Ux.toForm(form, $options.form);
        }
        config.form = form;
    }
    */
    /*
     * `magic`：特殊参数
     * `addon`：特殊配置
     * `control`：和后端的 UI_CONTROL 对应
     */
    if (addOn.hasOwnProperty('control')) {
        config.magic = Ux.clone(addOn.magic);
        config.control = addOn.control;
        config.addon = Ux.clone(addOn.addon);
    }
    /*
     * Dialog 窗口配置
     */
    if (addOn.dialog) {
        config.dialog = {
            title: Ux.clone(addOn.dialog),
            modal: addOn.modal,
        }
    }
    attrs.config = Ux.clone(config);
    /* Form 特殊配置 */
    attrs.$inited = Ux.clone(data);
    /* Add表单专用 */
    const {$addKey, $mode, $identifier} = reference.props;
    if ($addKey) {
        /* 客户端提供主键 */
        attrs.$addKey = $addKey;
    }
    if ($mode) {
        attrs.$mode = $mode;
    }
    /* 挂载 identifier 专用 */
    if ($identifier) {
        attrs.$identifier = $identifier;
    }
    /* 表单控制专用（将控制写入到 attrs 中 */
    const acl = Ux.aclData(data, reference, {});
    Object.assign(attrs, acl);
    return attrs;
};

/**
 * ## 扩展函数
 *
 * 按钮和操作专用，`ExAction/ExButton` 专用的处理。
 *
 * 按钮专用过滤函数，主要过滤几种：
 *
 * 1. Open区
 * 2. Batch区
 * 3. Search区
 * 4. Extra区
 * 5. Row区
 *
 * 扩展区域
 *
 * @memberOf module:_channel
 * @method yoAction
 * @param {ReactComponent} reference React对应组件引用
 * @param {String} prefix 操作前缀
 * @param {Object} ordered 排序专用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoAction = (reference, prefix = "", ordered) => {
    /*
     * 环境数据
     */
    const attrs = yoAmbient(reference);
    /*
     * 配置数据
     */
    const {op = {}} = reference.state;
    /*
     * 前缀处理
     */
    if (ordered) {
        /*
         * 有序排列
         */
        const buttons = ordered[prefix];
        if (Ux.isArray(buttons) && 0 < buttons.length) {
            /* 按顺序读取，几个不同区域的配置 */
            attrs.config = buttons.map(key => op[key])
                .filter(item => !!item);
        }
    } else {
        /*
         * 无序排列
         */
        attrs.config = Object.keys(op)
            .filter(opKey => opKey.startsWith(prefix))
            .map(opKey => op[opKey])
            .filter(item => !!item);
    }
    return attrs;    // 去掉 undefined;
}

const _outReady = (form, message, debug = {}) => {
    const {name, color} = debug;
    if (form) {
        const isTouched = form.isFieldsTouched();
        if (!isTouched) {
            Ux.dgDebug(message, `[ ${name} ] Form Ready `, color);
        }
    } else {
        if (!debug.off) {
            Ux.dgDebug(message, `[ ${name} ] Ready `, color);
        }
    }
};

const _outLoading = (name, message) => {
    Ux.dgDebug(message, `............ [ ${name} ] `, "#9E9E9E");
};
/**
 * ## 扩展函数
 *
 * （高频函数）执行渲染拦截的专用函数：
 *
 * 1. `$ready = true`，执行渲染。
 * 2. `$ready = false`，不执行渲染，只 Loading。
 *
 * @memberOf module:_channel
 * @method yoRender
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnJsx 执行jsx的Render
 * @param {Object} debug 调试信息
 * @returns {JSX.Element}
 */
const yoRender = (reference = {}, fnJsx, debug = {}) => {
    const state = reference.state ? reference.state : {};
    const {error} = state;
    if (error) {
        /*
         * fxError 已经切换 fxFailure
         */
        return Ux.E.fxFailure(error);
    } else {
        /*
         * Debug专用
         */
        const props = reference.props;
        const {name} = debug;
        const {$ready = false} = state;

        const {$height, form} = props;
        if ($ready) {
            _outReady(form, {props, state}, debug);
            return Ux.isFunction(fnJsx) ? fnJsx() : fnJsx;
        } else {
            _outLoading(name, {props, state});
            return (<LoadingContent $height={$height}/>);
        }
    }
}

const isBatchEnabled = (reference) => {
    const {op = {}} = reference.state;
    let counter = 0;
    Object.keys(op).forEach(opKey => {
        if (opKey.startsWith('op.batch')) {
            counter += 1;
        } else if (opKey.startsWith("op.extension")) {
            const button = op[opKey];
            const region = button.region ? button.region : "";
            if (region.startsWith("op.batch")) {
                counter += 1;
            }
        }
    });
    return 0 < counter;
};

const yoTable = (reference) => {
    const inherit = yoList(reference);
    /*
     * 配置数据
     */
    const state = reference.state;
    const {table = {}, $terms = {}} = state;
    inherit.config = table;
    /*
     * 是否支持批量
     */
    const {plugins = {}} = reference.state;
    inherit.$batch = isBatchEnabled(reference);
    inherit.$plugins = plugins;
    /*
     * $executor 函数专用（不能漏掉该函数）
     */
    const {$executor} = reference.props;
    if ($executor) {
        inherit.$executor = $executor;
    }
    /*
     * 是否 dirty
     */
    const {$dirty = false, $loading = false, $dirtyAsync = false} = state;
    inherit.$dirty = $dirty;
    inherit.$loading = $loading;
    inherit.$dirtyAsync = $dirtyAsync;
    /*
     * 列过滤信息
     */
    inherit.$terms = $terms;
    return inherit;
}
/*
 * 启用 / 禁用状态处理
 */
const yoTab = (reference, {
    items = [], // 总的 items
    index = 0,  // 当前 item的索引
    item,       // 当前 item
}) => {
    if (item) {
        const {options = {}} = reference.state;
        /* 打开Tab页的限制，默认是1 */
        let counter = 1;
        if (options.hasOwnProperty(Fn.Opt.TABS_COUNT)) {
            counter = Ux.valueInt(options[Fn.Opt.TABS_COUNT], 1);
        }
        /*
        * 如果 length = ( counter + 1 )
        * 则禁用 index = 0 的首页签
        * */
        if (counter <= (items.length - 1)) {
            /*
             * 禁用第一页（如果打开页码超过上限，那么直接禁用第一页，防止再打开新的页签
             */
            item.disabled = (0 === index);
        }
        /*
         * 强制打开最后剩余的一页
         */
        if (1 === items.length && 0 === index) {
            item.disabled = false;
        }
        return item;
    }
}

const isSatisfy = (reference, view = Fn.Mode.LIST) => {
    const {options = {}} = reference.state;
    if (Fn.Mode.LIST !== view) {
        /*
         * 如果是添加
         */
        if (Fn.Mode.ADD === view) {
            /*
             *  ADD 添加视图
             *  tabs.extra.add 键值
             *  1）如果没有该值，则显示
             *  2）如果有该值，那么该值必须存在
             */
            if (options.hasOwnProperty(Fn.Opt.TABS_EXTRA_ADD)) {
                return !!options[Fn.Opt.TABS_EXTRA_ADD];
            } else return true;  // 不设置直接 true
        } else if (Fn.Mode.EDIT === view) {
            /*
             *  EDIT 编辑视图
             *  tabs.extra.edit 键值
             *  1）如果没有该值，则显示
             *  2）如果有该值，那么该值必须存在
             */
            if (options.hasOwnProperty(Fn.Opt.TABS_EXTRA_EDIT)) {
                return !!options[Fn.Opt.TABS_EXTRA_EDIT];
            } else return true;  // 不设置直接 true
        } else return false; // 否则 false
    } else return false; // 否则 false
};
const isOk = (item = {}) => {
    const $category = Ux.immutable([
        "op.submit.save",
        "op.submit.delete",
        "op.submit.reset"
    ]);
    return $category.contains(item.category)
};
const setEdition = (attrs = {}, reference) => {
    const {$inited = {}} = reference.state;
    const {metadata} = $inited;
    if (!Ux.isEmpty(metadata)) {
        const {plugins} = reference.state;
        const executor = plugins && Ux.isFunction(plugins.pluginRow) ?
            plugins.pluginRow : () => null;
        const result = executor($inited, reference);
        attrs.config.filter(isOk).forEach(item => {
            /*
             * 是否可编辑
             */
            if ("op.submit.delete" === item.category) {
                item.visible = !!result.deletion;
            }
            if ("op.submit.save" === item.category) {
                item.visible = !!result.edition;
            }
            if ("op.submit.reset" === item.category) {
                item.visible = !!result.edition || !!result.deletion;
            }
        })
    }
};
const yoTabExtra = (reference, tabs = {}) => {

    /*
     * 提交状态
     * state -> $submitting
     * state -> view
     */
    const {$submitting = false, $view = Fn.Mode.LIST} = reference.state;
    if (isSatisfy(reference, $view)) {
        /*
         * 1.添加流程
         * 2.编辑流程
         * 双流程单独处理
         */
        const prefix = Fn.Mode.ADD === $view ? "op.add" : "op.edit";
        /*
         * 特殊配置
         * 1）tab.extra.add
         * 2）tab.extra.edit
         */
        const attrs = yoAction(reference, prefix, Order);
        /*
         * 扩展执行
         */
        attrs.config = yoExtension(reference, "op.tab", attrs.config);
        /*
         * 编辑界面核心操作
         */
        if (Fn.Mode.EDIT === $view) {
            /*
             * 设置可编辑的基础关系
             */
            setEdition(attrs, reference);
            /* 处理 config */
            if (attrs.config && 1 === attrs.config.length) {
                /*
                 * 单 reset 不呈现
                 * 此种情况只有一个 RESET 按钮，直接过滤掉
                 ***/
                attrs.config = attrs.config.filter(item => "op.submit.reset" !== item.category);
            }
        }
        attrs.$submitting = $submitting;
        attrs.$activeKey = tabs.activeKey;
        attrs.$view = $view;
        /* 核心参数传入 ExAction */
        attrs.doSubmitting = Fn.rxSubmitting(reference);
        // attrs.fnSubmitting = Fn.generate(reference).submitting;
        return Ux.sorterObject(attrs);
    }
}

const yoFormAdd = (reference, item = {}) => {
    const formAttrs = yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = rxClose(reference, item);
    /*
     * 设置 state -> $dirty 的函数
     */
    formAttrs.doDirty = Fn.rxDirty(reference);
    formAttrs.doSubmitting = Fn.rxSubmitting(reference);
    /*
     * 设置唯一的 $addKey
     * 这个值就是 Tab 中的 activeKey
     */
    formAttrs.$addKey = item.key;
    formAttrs.$mode = Ux.Env.FORM_MODE.ADD;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}} = reference.state;
    if (options[Fn.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[Fn.Opt.IDENTIFIER];
    }
    /*
     * 提供 $query 用于处理特殊条件
     * Tabular / Category
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    /*
     * 插件
     */
    const $plugins = {};
    if (Ux.isFunction(plugins.pluginField)) {
        $plugins.pluginField = plugins.pluginField;
    }
    formAttrs.$plugins = $plugins;
    return formAttrs;
}

const yoFormEdit = (reference, item = {}) => {
    const formAttrs = yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = rxClose(reference, item, false);
    formAttrs.rxView = Fn.rxView(reference);
    /*
     * 设置 state -> $dirty
     */
    formAttrs.doDirty = Fn.rxDirty(reference);
    formAttrs.doSubmitting = Fn.rxSubmitting(reference);
    formAttrs.$mode = Ux.Env.FORM_MODE.EDIT;
    /*
     * 读取 $identifier（动态表单必须）
     */
    const {options = {}, plugins = {}} = reference.state;
    if (options[Fn.Opt.IDENTIFIER]) {
        formAttrs.$identifier = options[Fn.Opt.IDENTIFIER];
    }
    /*
     * 设置表单初始值
     */
    const {$inited = {}, $rowData} = reference.state;
    formAttrs.$inited = $inited;
    /*
     * 表单编辑的优雅转换
     *
     */
    const $plugins = {};
    if (Ux.isFunction(plugins.pluginRow)) {
        /*
         * 标准的编辑内容
         */
        $plugins.pluginForm = plugins.pluginRow;
    }
    if (Ux.isFunction(plugins.pluginField)) {
        $plugins.pluginField = plugins.pluginField;
    }
    formAttrs.$plugins = $plugins;
    /*
     * 设置基础查询条件
     */
    const {$query = {}} = reference.props;
    formAttrs.$query = $query;
    /*
     * 合并执行
     * 1. 从 formAttrs 中提取 $record 专用上层变量
     * 2. 在 $record 变量中挂载 rowData 属性
     * 3. 将 $record 直接传入到底层数据中
     */
    if (!formAttrs.$record) formAttrs.$record = {};
    if ($rowData) formAttrs.$record.rowData = $rowData;
    return formAttrs;
}


const yoListSearch = (reference) => {
    const attrs = yoDynamic(reference);
    /*
     * 提取选项
     */
    const {options = {}} = reference.state;
    const config = {};
    attrs.$options = options;
    Object.keys(options)
        .filter(optKey => optKey.startsWith('search'))
        .forEach(optKey => config[optKey] = options[optKey]);
    attrs.config = config;
    /*
     * 表单组件下放
     */
    const {$form = {}} = reference.props;
    attrs.$form = $form;
    /*
     * 查询条件专用处理
     */
    const {$filters = {}, $filtersRaw = {}} = reference.state;
    if ($filtersRaw) {
        /*
         * 引入组件过后的操作
         */
        attrs.$inited = $filtersRaw;
    } else {
        attrs.$inited = $filters;
    }
    /*
     * 清空按钮专用状态
     */
    attrs.$disableClear = (0 === Object.keys($filters).length);
    /*
     * 条件修改，注入 fnCondition 函数
     * 外置搜索框处理 $condition 变量（和列筛选呼应）
     * 不改变 $condition 部分的信息，只改动 $filters 相关信息
     */
    // attrs.rxCondition = Ex.rxCondition(reference);
    // attrs.rxQuery = Ex.rxQuery(reference);
    // attrs.rxClean = Ex.rxClean(reference);
    attrs.rxFilter = Fn.rxFilter(reference);
    return attrs;
}

const yoListOpen = (reference) => {
    const attrs = yoAction(reference, "op.open", Order);
    /*
     * 清空按钮专用，设置
     * disabled / enabled状态
     */
    let isFiltered = attrs.config.filter(item => "op.open.filter" === item.category);
    if (0 < isFiltered.length) {
        const ref = isFiltered[0];
        if (ref) {
            const {$condition = {}} = reference.state;
            if (0 === Object.keys($condition).length) {
                /*
                 * $condition 无值
                 * 初始态
                 */
                ref.disabled = true;
            } else {
                /*
                 * $condition 中每一个键的搜索长度都为 0
                 * 中间态
                 */
                const counter = Object.keys($condition).map(key => $condition[key])
                    .filter(value => 0 < value.length);
                /*
                 * 状态需要切换
                 */
                ref.disabled = 0 === counter.length;
            }
        }
    }
    /*
     * 挂载 extension 部分
     */
    // const extension = yoExtension(reference, "op.open");
    // attrs.config = [].concat(extension).concat(attrs.config);
    attrs.config = yoExtension(reference, "op.open", attrs.config);
    return attrs;
}
const yoListBatch = (reference) => {
    let batch = yoAction(reference, 'op.batch', Order);
    /*
     * batch是数组，则处理 disabled 状态
     */
    const {$selected = [], $submitting = false} = reference.state;
    batch.$category = "LINK";
    batch.doSubmitting = Fn.rxSubmitting(reference);
    batch.doDirty = Fn.rxDirty(reference);
    /*
     * ExBatchEditor 列专用处理
     */
    batch = yoBatchEditor(batch, reference);
    /*
     * ExBatchEditor 中需要的外层函数
     */
    batch.rxBatchEdit = Fn.rxBatchEdit(reference);
    /*
     * 选中项
     */
    batch.$selected = Ux.clone($selected);
    batch.$submitting = $submitting;
    /*
     * 挂载 extension 部分
     */
    // const extension = yoExtension(reference, "op.batch", batch.config);
    // batch.config = [].concat(batch.config).concat(extension);
    batch.config = yoExtension(reference, "op.batch", batch.config);
    /*
     * Disabled-001：初始化
     */
    if (batch.config) {
        batch.config.map(each => each.disabled = 0 === $selected.length);
    }
    return Ux.sorterObject(batch);
}

const yoListExtra = (reference) => {
    const editorRef = yoAction(reference, "op.extra", Order);
    /*
     * $columns：全列
     * $columnsMy：我选择的列
     */
    const {
        $columns = [], $columnsMy = [],
    } = reference.state;
    /*
     * 核心配置信息传入
     */
    editorRef.config.forEach((config = {}) => {
        /*
         * 抽取组件配置信息
         */
        const {component = {}} = config;
        const editorRef = component.config;
        /*
         * 每个组件都需要（特殊处理）
         */
        editorRef.$columns = $columns;
        editorRef.$columnsMy = $columnsMy;
    });
    /*
     * rxColumnSave
     * rxExport
     * 直接的 Ajax方法处理
     */
    editorRef.rxColumnSave = Fn.rxColumnSave(reference);
    editorRef.rxExport = Fn.rxExport(reference);
    editorRef.rxImport = Fn.rxImport(reference);
    /*
     * 不带 Ajax 的专用回调函数，用于 rxColumnSave 的回调
     * 主要是参数需要计算，所以这里只能使用双阶段来处理列保存
     * 1）调用 rxColumnSave 方法
     * 2）执行 rxProjection 的回调（目前支持Table，后期可以考虑支持其他）
     */
    editorRef.rxProjection = Fn.rxProjection(reference);
    editorRef.rxDirty = Fn.rsDirty(reference);
    /*
     * 提交专用函数
     */
    editorRef.doSubmitting = Fn.rxSubmitting(reference);
    /*
     * 计算最新配置
     * ExEditorColumn
     */
    return Ux.sorterObject(editorRef);
}
export default {
    /**
     * ## 扩展函数
     *
     * 同`yoAmbient`，重名函数，赋予语义的函数名。
     *
     * @memberOf module:_channel
     * @method yoComponent
     * @param {ReactComponent} reference React对应组件引用
     * @param {Object} config 额外的配置数据
     * @returns {Object} 计算最终生成的继承属性专用方法
     */
    yoComponent: yoAmbient, // 环境数据（统一处理）
    yoAmbient,              // 环境数据（统一处理）
    yoDynamic,
    yoPolymorphism,
    yoControl,
    yoForm,
    yoFilter,
    yoAction,
    yoList,
    yoRender,           // 普通组件专用渲染

    yoTable,            // 表格

    yoTab,              // Tab页签
    yoTabExtra,         // Tab页 Extra 区域

    yoFormAdd,          // 添加表单
    yoFormEdit,         // 编辑表单

    yoListSearch,       // 搜索区域
    yoListOpen,         // 打开区域
    yoListBatch,        // 批量区域
    yoListExtra,        // 额外区域
}