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

const _seedOptionPre = (reference) => {
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
    uniform.$options = Ux.sorterObject(optionData);
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
 * ## 「通道」`Ex.yoAmbient`
 *
 * ### 1. 基本介绍
 *
 * 该方法为高频使用方法，几乎所有的组件需要继承属性时调用该方法生成`inherit`属性集。
 *
 * ### 2. 核心属性
 *
 * 计算继承属性（统一继承属性专用处理），统一继承的属性：
 *
 * 1. 基本属性：
 *      * $app：应用数据，DataObject
 *      * $user：登录用户数据，Object
 *      * $router：路由数据，DataRouter
 *      * $menus：菜单专用数据，DataObject
 *      * $profile: 登录用户Profile信息
 *      * $parent: 父记录专用数据
 *      * $submitting：redux防重复提交专用
 *      * **$hotel**：旧系统专用
 * 2. 标识符专用属性，读取属性中的 $identifier 模型标识符。
 * 3. 特殊禁用变量：$disabled 属性。
 * 4. 提交状态变量
 *      * $submitting：正在提交
 *      * $loading：正在加载
 *      * $dirty：脏数据
 *      * $collapsed：菜单开合处理
 * 5. 选中项：$selected
 * 6. 函数处理，继承函数前缀：`rx, do, fn`。
 * 7. 特殊引用
 *      * reference：父引用
 *      * react：根引用
 * 8. 插件配置
 *      * $plugins：插件继承
 * 9. 选项`$options`处理，执行`_seekOption`方法：
 *
 * 10. 编程配置 config 合并到 `uniform.config`中形成最终配置。
 * 11. Assist数据提取，从 props 和 state 中提取，之后处理 rxAssist 中部函数。
 * 12. 动态操作符：`$opKey` 注入
 * 13. 附加配置：`$record` 专用处理
 *      * 外层变量是单变量，用于记录拷贝
 *      * 如果是数组，必定会在 Form 中选择方式，那可直接走 Assist
 *      * 外层变量会在config过程中引入特殊属性`rowData`用于记录外层选中记录
 * 14. 配置处理完过后冻结，调用：`freeze`
 *
 * ### 3. 属性继承表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |$app|props|DataObject|$app|应用程序配置数据，也可以直接调用`Ux.isInit()`读取。|
 * |$user|props|Object|$user|登录用户基础数据，也可以直接调用`Ux.isLogged()`读取。|
 * |$profile|props|DataObject|$profile|（保留属性）|
 * |$router|props|DataRouter|$router|react-router路由器专用对象。|
 * |$menus|props|Array|$menus|当前应用程序所需的所有菜单信息。|
 * |$parent|props|Object|$parent|父记录数据（直接引用父记录），一般存储顶层记录数据。|
 * |$identifier|props|String|$identifier|统一模型标识符。|
 * |$disabled|props|Boolean|$disabled|是否禁用组件。|
 * |$submitting|props|Boolean/DataObject|$submitting|如果是redux则是DataObject对象，如果是state中读取，则是Boolean类型。|
 * |$selected|props|Any|$selected|从属性中直接继承`$selected`变量（选中项）。|
 * |函数|props|Function|rx/fn/do|从属性中继承所有函数属性，rx，fn，do三种。|
 * |this|无|React|reference|构造当前引用，该引用会输入成为组件消费的父引用（Zero Ui基础规范）。|
 * |react|无|React|react|顶层引用。|
 * |$collapsed|props|Boolean|$collapsed|当前应用的菜单打开/关闭状态。|
 * |$plugins|props|Object|$plugins|需要继承的插件属性信息。|
 * |$options|props|Object|$options|「低优先级」（从属性继承）选项数据。|
 * |$options|state|Object|$options|「中优先级」（从当前组件状态中构造）选项数据。|
 * |module.options|state|Object|$options|「高优先级」（从当前组件$hoc中读取，远程加本地）选项数据。|
 * |辅助数据|props|DataArray|`$t_/$a_`|读取属性直接继承的辅助数据。|
 * |辅助数据|state|DataArray|`$t_/$a_`|读取当前组件状态中构造的辅助数据（优先级更高）。|
 * |$opKey|props|String|$opKey|动态配置时使用的操作主键`$opKey`。|
 * |$record|props|Any|$record|记录专用数据，结构很多，在DialogEditor中还包含了专用rowData数据。|
 * |config|计算|Object|config|计算最终的组件配置信息。|
 *
 * ### 4. 函数核心
 *
 * #### 4.1. _seekOption
 *
 * 在`$options`属性构造过程中，原始的`uniform.$options = yoOption(reference);`已经被废弃，采用新的
 * `_seekOption/_seekOptionPre`方法执行计算
 *
 * 1. 先调用`_seekOptionPre`方法
 * 2. 再调用`_seekOption`方法
 *
 * 配置源头来自于几处：
 *
 * 1. props属性中的`$options`变量存储的配置信息。
 * 2. state状态中`$options/options`两个变量，options是旧系统专用变量（暂时不废弃），$options是统一过后的新变量。
 * 3. 如果存在`$hoc`（执行过资源绑定），那么读取`_module`节点（远程加本地），使用`module.options`执行再合并。
 *
 * #### 4.2. $record/$parent
 *
 * 这两个变量都用于存储父记录数据
 *
 * * $parent：父记录专用数据（旧系统模式），标准格式Object
 * * $record：扩展模块才出现的专用数据，附加额外的父类数据结构
 *      * rowData：DialogEditor中用来存储选中行的数据信息。
 *
 * 类似下边布局
 *
 * ```
 * |--------------------------------------------------|
 * |  Form (Grid)                                     |
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * |--------------------------------------------------|
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |--------------------------------------------------|
 * ```
 *
 * * `$parent`存储的是`Form(Grid)`表单的完整数据。
 * * `$record.rowData`存储的是字段中某一行的数据（子表单增删改）。
 *
 * #### 4.3. $record/$options
 *
 * * $options用于继承配置内容，元数据继承。
 * * $record用于继承数据内容，数据继承。
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
    uniform.$options = _seedOptionPre(reference);
    /*
     * 特殊变量
     * $disabled
     */
    const {$disabled = false} = props;
    if ($disabled) {
        /* 只接收 $disabled = true */
        uniform.$disabled = $disabled;
    }
    // eslint-disable-next-line
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
     * react: 根引用
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
    // eslint-disable-next-line
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
 * ## 「通道」`Ex.yoDynamic`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，然后追加配置：
 *
 * > （新版移除了$identifier，挪动到yoAmbient中，静态动态都会使用）
 *
 * 1. 追加$controls控件配置信息，直接继承`$controls`配置数据
 * 2. 初始化数据 $inited，直接继承初始化表单数据（表单专用）
 * 3. $mode，表单模式，`ADD | EDIT`传入
 * 4. $fabric，Ox的`Fabric`引擎专用变量，存储了fabric相关配置信息
 *
 * ### 2. 属性继承表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |$controls|props|Any|$controls|控件配置数据。|
 * |$inited|props|Object|$inited|专用表单初始化数据。|
 * |$mode|props|String|$mode|表单模式，ADD = 添加模式，EDIT = 编辑模式。|
 * |$fabric|props|Object|$fabric|Fabric引擎专用定义数据（执行Ox逻辑专用）。|
 *
 * ### 3. 关于$inited
 *
 * 1. 默认读取props中的`$inited`变量作为继承的表单初始化数据
 * 2. 如果当前组件的状态state中生成了新的`$inited`数据
 *      * 子表单专用，使用state中的`$inited`数据构造子表单初始化数据
 *      * 构造rxView函数用于更改当前状态中的表单初始化数据
 *
 * ```
 *     $inited
 * ---------------> props（低优先级）
 *                                  $inited, rxView
 *           ------ state（高优先级）------------------> 子组件
 *           |        |
 *        $inited     |
 *           |        |
 *           ---------|
 * ```
 *
 * @memberOf module:_channel
 * @method yoDynamic
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
const yoDynamic = (reference = {}) => {
    const attrs = yoAmbient(reference);
    const {
        $controls = {}, $inited,
        $mode, $fabric = {}
    } = reference.props;
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
 * ## 「通道」`Ex.yoPolymorphism`
 *
 * ### 1. 基本介绍
 *
 * 动态扩展配置，前置调用`yoAmbient`方法处理统一配置，之后追加：
 *
 * 1. 直接读取fromHoc中的grid配置
 * 2. 如果传入了专用表单配置，则处理form表单配置，填充$form变量
 * 3. state中的$query读取
 * 4. state中的config.options中读取$identifier
 * 5. 构造$inited中的$identifier
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |config|state|Object|config|直接从 grid 中读取核心配置，Ox组件动态渲染专用。|
 * |$query|state|Object|$query|构造子组件所需的查询条件。|
 * |form|第二参|Object|$form|表单配置，使用拷贝config改变原始配置。|
 * |$identifier|props|String|$identifier|统一模型标识符。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 特定场景
 *
 * 对应特定界面处理，目前常用于`X_CATEGORY`和`X_TABULAR`的管理。
 *
 * ```
 * |--------------------------------------------------|
 * |  Menu  |  Content ( List )                       |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |        |  Row                                    |
 * |--------------------------------------------------|
 * ```
 *
 * * 左边部分是选择。
 * * 右边部分是一个完整带有List界面的主界面（`ExListXxx`页）。
 *
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
 * ## 「通道」`Ex.yoControl`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 输入配置的基本信息如（四大基本组件）：
 *
 * ```
 * {
 *     "type": "COMPONENT / LIST / FORM / CONTAINER",
 *     "sign": "64位随机加密字符串，组件创建时生成，后期可验证属性的版本。"
 * }
 * ```
 *
 * 代码执行流程如下
 *
 * 1. `type = CONTAINER`：调用`_seekContainer`处理容器配置。
 * 2. `type <> CONTAINER`的类型：
 *      1. 先调用`_seekContainer`处理容器配置。
 *      2. 再调用`_seekComponent`处理组件配置。
 *
 * ### 2. 核心流程解析
 *
 * #### 2.1. `_seekContainer`
 *
 * > componentName存在时才能构造容器配置，否则传入的`attrs`为空对象。
 *
 * 函数签名：
 *
 * ```js
 * const _seekContainer = (attrs = {}, control = {}, componentType)
 * ```
 *
 * 主要是构造`attrs.container`对象，输入的control数据结构如下：
 *
 * ```js
 * {
 *      containerConfig: "容器基础配置信息",
 *      containerName: "「Required」容器名称，必须包含该配置"
 * }
 * ```
 *
 * 构造的`container`的数据结构如下：
 *
 * ```js
 * {
 *     key: "设置成控件主键 control.key",
 *     pageId: "读取控件中关联页面ID control.pageId",
 *     name: "设置成containerName的值",
 *     config: "读取containerConfig，否则就直接置空 {}",
 *     componentType: "函数中的第三参"
 * }
 * ```
 *
 * #### 2.2. `_seekComponent`
 *
 * 函数签名：
 *
 * ```js
 * const _seekComponent = (attrs = {}, control = {}) => {
 * ```
 *
 * 直接构造组件配置，输入的control数据结构如下：
 *
 * ```js
 * {
 *     componentConfig: "组件基础配置信息",
 *     componentData: "当前组件依赖的数据信息",
 *     componentName: "当前组件名称"
 * }
 * ```
 *
 * 构造的最终`attrs`数据结构如下：
 *
 * ```js
 * {
 *     key: "设置成控件主键 control.key",
 *     pageId: "读取控件中关联页面ID control.pageId",
 *     name: "设置成componentName的值",
 *     config: "设置成componentConfig，否则直接置空",
 *     source: "设置成componentData，作为当前组件专用数据源"
 * }
 * ```
 *
 * ### 3. 容器/组件
 *
 * 动态渲染过程中，最终形成的jsx的数据结构如：
 *
 * ```jsx
 * <!-- 容器层 -->
 * <Container>
 *     <!-- 组件层 -->
 *     <Component/>
 * </Container>
 * ```
 *
 * ### 4. 后端动态输入
 *
 * 后端动态输入的结构来自于`UI_CONTROL, UI_LIST, UI_FORM`几张表，完整数据结构如下：
 *
 * ```json
 * {
 *     
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
 * ## 「通道」`Ex.yoList`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * `ExListXX`组件专用方法，为列表构造所有对应的属性。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |$query|props|Object|$query|构造默认查询条件，该条件每次执行远程调用后会被重置。|
 * |$selected|state|Array|$selected|当前列表选中的行。|
 * |$options|state|Object|$options|当前列表的所有配置选项，options节点，属性名中带`.`操作符。|
 * |$condition|state|Object|$condition|列过滤专用条件。|
 * |构造||Function|rxSearch|加载列表数据专用方法，排序、服务端分页。|
 * |构造||Function|rxCondition|设置列过滤条件，点击列过滤时专用函数。|
 * |构造||Function|rxOpen|打开新的Tab页专用函数。|
 * |构造||Function|rxSelected|选择行数据时专用函数，用于恢复状态专用。|
 * |构造||Function|rxDelete|删除行记录专用函数。|
 * |构造||Function|rxView|查看行记录数据专用函数。|
 * |构造||Function|doLoading|设置加载状态。|
 * |构造||Function|doDirty|（脏数据标记）更改数据状态为脏数据，然后触发列表的自动加载。|
 * |rxPostDelete|props|Function|rxPostDelete|行删除专用回调函数。|
 * |rxPostView|props|Function|rxPostView|读取行记录专用回调函数。|
 *
 * ### 3. 关于$query
 *
 * `$query`是整个List组件中最复杂的部分，它包含两部分内容。
 *
 * #### 3.1. 构造默认条件
 *
 * 调用`Ux.qrInherit`函数构造默认查询条件：
 *
 * 1. 基础查询条件
 *      1. 如果props中传入了`$query`了，则以此为默认的基础查询条件。
 *      2. props中未传入，则以state中的`query`为默认基础条件。
 * 2. 然后结合状态中的更改条件执行计算（配合QQuery对象）
 *      1. $condition：列过滤导致的查询条件更改。
 *      2. $filters：表单查询（基础/高级）导致的查询条件的更累。
 * 3. 合并到一起后执行最终的运算，如果要移除，则使用`__DELETE__`值。
 * 4. 计算时键值使用`field,op`，如`name,=`和`name,>`虽然是同一个字段，表示两个不同的条件。
 *
 * #### 3.2. 关于Dirty
 *
 * `doDirty`只在动态渲染界面中使用，当系统检测当前List出现了`dirty = true`的状态时，系统会自动
 * 刷新当前列表数据（调用rxSearch和默认查询条件）。
 *
 * #### 3.3. Post系列
 *
 * Post系列用于行操作时的回调，目前只提供两种：
 *
 * * rxPostDelete：删除行时的回调函数。
 * * rxPostView：读取行记录时的回调函数。
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
     * rxPost系列
     */
    const {rxPostDelete, rxPostView} = reference.props;
    if (Ux.isFunction(rxPostDelete)) {
        inherit.rxPostDelete = rxPostDelete;
    }
    if (Ux.isFunction(rxPostView)) {
        inherit.rxPostView = rxPostView;
    }
    return inherit;
}
/**
 * ## 「通道」`Ex.yoFilter`
 *
 * > 优先读取`Ex.yoDynamic`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 查询表单专用，构造查询信息，内置先调用`yoDynamic`处理。
 *
 * 1. 初始化表单值`$inited`，赋予`connector`的连接符。
 * 2. rxClose构造，可关闭子表单。
 *
 * ### 2. $inited
 *
 * 该方法会为表单数据追加`connector`字段（搜索条件表单专用）。
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
 * ## 「通道」`Ex.yoForm`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 该函数的处理内容：
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
 * ### 2. 属性继承表
 *
 * #### 2.1. 构造`config`属性
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |form|addOn|Object|config.form|编程模式下的表单配置。|
 * |_form|cab|Object|config.form|前端静态配置（主配置）。|
 * |_formUp|cab|Object|config.form|前端静态上表单配置（辅助配置）。|
 * |_formDown|cab|Object|config.form|前端静态下表单配置（辅助配置）。|
 * |_form|ajax|Object|config.form|后端动态配置（主配置）。|
 * |_formUp|ajax|Object|config.form|后端动态上表单配置（辅助配置）。|
 * |_formDown|ajax|Object|config.form|后端动态下表单配置（辅助配置）。|
 * |assist|addOn|Object|assist|表单中的辅助数据定义。|
 * |magic|addOn|Object|magic|数据远程加载专用配置。|
 * |addon|addOn|Object|addon|附加组件专用配置。|
 * |control|addOn|Object|control|读取`UI_FORM`专用远程配置。|
 * |dialog|addOn|Object|dialog|（标题）构造窗口配置。|
 * |modal|addOn|Object|modal|（配置）构造窗口配置。|
 *
 * #### 2.2. 特殊继承属性
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |data|入参|Object|$inited|构造表单专用数据。|
 * |$mode|props|String|$mode|表单模式：ADD,EDIT。|
 * |$addKey|props|Any|$addKey|添加生成的UUID，作为子表单专用主键。|
 * |$identifier|props|String|$identifier|统一模型标识符。|
 * ||计算|Object|__acl|表单权限基础数据。|
 *
 * ### 3. 表单布局计算
 *
 * #### 3.1. 配置数据源
 *
 * 1. addOn.form：通过编程部分拿到的 form 信息
 * 2. S0（前端静态文件）_form：前端静态配置（主配置）——通常静态form使用此配置
 * 3. S1（前端上表单）_formUp：前端静态配置（辅助配置）
 * 4. S2（前端下表单）_formDown：前端静态配置（辅助配置）
 * 5. D0（后端动态文件）form：后端主配置
 * 6. D1（后端上表单）formUp：后端主配置
 * 7. D2（后端下表单）formDown：后端主配置
 * 布局最终顺序：
 *
 * ```js
 * 表单布局顺序       模式1     模式2     模式3
 * addon.form
 *         S1                           o
 *         D1
 *         S0        o         o        o
 *         D0                  o        o
 *         S2                           o
 *         D2
 * ```
 *
 * > 有了上述结构后，可根据资源文件和远程配置构造不同的表单布局字段数据（2 x 3合计六个维度）。
 *
 * #### 3.2. 关于表单的权限说明
 *
 * （略）后期补充
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
 * ## 「通道」`Ex.yoAction`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集。
 *
 * ### 1. 基本介绍
 *
 * 按钮和操作专用，`ExAction/ExButton` 专用的处理。
 *
 * 按钮专用过滤函数，主要过滤几个区域的核心按钮：
 *
 * 1. Open区
 * 2. Batch区
 * 3. Search区
 * 4. Extra区
 * 5. Row区
 * 6. Extension扩展（全区域）
 *
 * ### 2. 核心执行逻辑
 *
 * 该函数的核心执行逻辑如：
 *
 * 1. 调用`yoAmbient`初始化继承属性。
 * 2. 顺序计算/无序计算（针对state中的`op`变量定义）。
 * 3. 执行前缀过滤。
 *
 * ### 3. 默认值
 *
 * #### 3.1. 默认的顺序配置：
 *
 * ```json
 * {
 *      "op.open": [
 *          "op.open.add",
 *          "op.open.filter"
 *      ],
 *      "op.batch": [
 *          "op.batch.edit",
 *          "op.batch.delete"
 *      ],
 *      "op.extra": [
 *          "op.extra.column",
 *          "op.extra.export",
 *          "op.extra.import"
 *      ],
 *      "op.add": [
 *          "op.submit.add",
 *          "op.submit.reset"
 *      ],
 *      "op.edit": [
 *          "op.submit.save",
 *          "op.submit.delete",
 *          "op.submit.reset"
 *      ]
 * }
 * ```
 *
 * #### 3.2. 列表区域图示
 *
 * > 带`*`的是存在配置的区域。
 *
 * **列表页**
 *
 * ```
 * |--------------------------------------------------|
 * | *Open    *Batch               Search      *Extra |
 * |--------------------------------------------------|
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |  Row                                             |
 * |--------------------------------------------------|
 * ```
 *
 * **表单页**
 *
 * ```
 * |--------------------------------------------------|
 * |                                     *Add / *Edit |
 * |--------------------------------------------------|
 * |  Form (Grid)                                     |
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * |                                                  |
 * |--------------------------------------------------|
 * ```
 *
 * #### 3.3. 各项详解
 *
 * |页面|区域前缀|区域代码|值|含义|
 * |---|:---|:---|:---|:---|
 * |列表页|op.open|Open区域|op.open.add|添加新记录|
 * ||||op.open.filter|清空列过滤条件（每一列的列过滤条件清除按钮）|
 * ||op.batch|Batch区域|op.batch.edit|批量编辑|
 * ||||op.batch.delete|批量删除|
 * ||op.extra|Extra区域|op.extra.column|列更改区域|
 * ||||op.extra.export|导出按钮|
 * ||||op.extra.import|导入按钮|
 * |表单页|op.add|Add提交区|op.submit.add|添加按钮|
 * ||||op.submit.reset|重置按钮|
 * ||op.edit|Edit提交区|op.submit.save|保存按钮|
 * ||||op.submit.delete|删除按钮|
 * ||||op.submit.reset|重置按钮|
 *
 * 后边两个区域`Add提交区/Edit提交区`主要位于内置的表单页，除开上边的五个核心区域以外，还会根据
 * `op.extension`前缀对应的配置来追加自定义按钮，以完成按钮的配置流程。
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


/**
 * ## 「通道」`Ex.yoRender`
 *
 * ### 1. 基本介绍
 *
 * （高频函数）执行渲染拦截的专用函数：
 *
 * 1. `$ready = true`，执行渲染。
 * 2. `$ready = false`，不执行渲染，只 Loading。
 *
 * ### 2. 核心
 *
 * #### 2.1. 加载
 *
 * 该函数不提供属性集，主要用于加载，它和`xtReady`的区别点在于：
 *
 * * xtReady：自定义组件专用`economy`目录下的所有组件。
 * * yoRender：Extension组件专用`extension/ecosystem`目录下的扩展组件。
 *
 * #### 2.2. 过渡
 *
 * 这个函数主要为过渡效果量身打造。
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
            Ux.dgDebug({props, state}, `............ [ ${name} ] `, "#9E9E9E");
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
/**
 * ## 「通道」`Ex.yoTable`
 *
 * > 优先读取`Ex.yoList`构造继承属性集，当前版本提供给`ExListOpen`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * `ExListOpen`是新组件，在`ExListComplex`基础上去掉复杂的列过滤、查询等相关功能，只保留：
 *
 * 1. 行操作扩展，除开编辑、删除，还可定制其他行扩展按钮。
 * 2. 添加区域操作扩展，除开添加按钮，还可定制其他区域按钮。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |table|state|Object|config|表格的基础配置，对应`<Table/>`的配置。|
 * |op|state|Object|$batch|计算是否支持批量操作，如果不支持批量则批量区域不显示内容。|
 * |$plugins|state|Object|$plugins|可定制插件提供给表格列使用。|
 * |$executor|props|Object|$executor|提供`key = Function`的哈希表，用于执行直接的行操作回调。|
 * |$dirty|state|Boolean|$dirty|脏数据检查。|
 * |$loading|state|Boolean|$loading|当前表格是否处于加载状态，提交/加载过程都有可能。|
 * |$dirtyAsync|state|Boolean|$dirtyAsync|异步脏数据检查，对于某些特定场景下Ajax操作导致的脏数据检查。|
 *
 * ### 3. 核心
 *
 * 该操作核心内容在`yoList`中，附加内容只是追加过程，所以列表支持的功能，纯表格也同样支持。
 *
 * @memberOf module:_channel
 * @param {React} reference React组件引用
 * @returns {Object} 表格专用配置
 */
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
/**
 * ## 「通道」`Ex.yoTabPage`
 *
 * ### 1. 基本介绍
 *
 * 该函数用于构造`<Tabs/>`中每一页专用的配置，该值最终会构造`<Tabs.TabPane/>`元素。
 *
 * 核心逻辑
 *
 * 1. 根据`tabs.count`运算可打开的页签数，超过限制不再打开。
 * 2. 如果打开了新的页签，旧页签是否处于禁用状态（防止不专注工作副总用）。
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用
 * @param {Array} items 每一个页签的配置，构成完整数组
 * @param {Number} index 当前页签的索引信息
 * @param {Object} item 每一个页签的配置信息
 * @returns {Object}
 */
const yoTabPage = (reference, {
    items = [],           // 总的 items
    index = 0,          // 当前 item的索引
    item,                // 当前 item
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
/**
 * ## 「通道」`Ex.yoTabExtra`
 *
 * > 优先读取`Ex.yoAction`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理表单内部的按钮区域，它包含两种状态。
 *
 * |视图模式|按钮|含义|
 * |---|---|:---|
 * |add|`添加，重置`|添加表单界面专用按钮。|
 * |edit|`编辑，删除，重置`|编辑表单界面专用按钮。|
 *
 * 如果配置了`op.extension`那么扩展按钮会根据其`index`的配置插入到对应位置，并且这些按钮的显示还被下边两个因素影响：
 *
 * 1. 操作用户是否具有这些操作按钮的ACL权限。
 * 2. 这个列表中是否已经配置了这些按钮。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||state|config|计算当前Extra区域按钮的基本配置。|
 * |$submitting|state|Boolean|$submitting|是否处于提交状态（防重复提交专用属性）。|
 * |activeKey|第二参数|String|$activeKey|被激活的页签主键。|
 * |$view|state|String|$view|视图模式读取，三种：`list, add, edit`。|
 * |构造||Function|doSubmitting|防重复提交专用函数。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 满足构造条件
 *
 * 1. 视图模式必须是`add`或`edit`。
 * 2. 如果是`add`，必须配置了`tabs.extra.add`项。
 * 3. 如果是`edit`，必须配置了`tabs.extra.edit`项。
 *
 * > 如果构造条件不满足，那么extra部分不显示任何东西。
 *
 * #### 3.2. RESET
 *
 * 重置按钮是一个特殊的存在，必须是可操作按钮存在的情况才执行重置，如果不存在可操作按钮，那么重置会无效。
 *
 * 检测代码：
 *
 * ```js
 * // 检查是否计算结果是单独的重置按钮RESET
 * if (attrs.config && 1 === attrs.config.length) {
 *      attrs.config = attrs.config.filter(item => "op.submit.reset" !== item.category);
 * }
 * ```
 *
 * #### 3.3. 权限控制
 *
 * 调用`setEdition`内部私有方法计算可编辑的相关关系，实现对某个表单的ACL权限控制，直到可控制表单三态。
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用
 * @param {Object} tabs `<Tabs/>`的基本配置
 * @returns {Object}
 */
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
/**
 * ## 「通道」`Ex.yoFormAdd`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 该方法近似于`yoList`，但该属性集是传递给表单，附带了表单属性集。
 *
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||Function|rxClose|关闭表单容器专用回调方法。|
 * |构造||Function|doSubmitting|表单防重复加载设置提交状态专用方法。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |key|页签|Any|$addKey|添加表单主记录主键。|
 * |||String|$mode|固定值"ADD"。|
 * |options|state|Object|$identifier|当前列表的配置数据，从配置数据中抽取配置项：`identifier`。|
 * |plugins|state|Object|$plugins|为子表单计算`pluginField`字段控制专用函数。|
 * |$query|props|Object|$query|当前列表的查询条件，处理特殊条件专用。|
 * |$rowData|state|Object|$record.rowData|子表单中DialogEditor专用行选中记录信息。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于模型标识符
 *
 * 该方法在内部使用，为静态标识符，所以只支持静态模式下的identifier模型标识符读取，不从远程获取，
 * 远程获取会在`OxList`组件中完成，而不是`ExListXxx`组件中。
 *
 * #### 3.2. rxClose
 *
 * 关闭回调函数可以被子表单使用，子表单提交完成后通常会调用`rxClose`函数关闭表单返回到列表界面，
 * 返回时还会重新加载列表。
 *
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @param {Object} item 页签配置
 * @returns {Object} 传入添加子表单的属性集
 */
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
    const {options = {}, plugins = {}, $rowData} = reference.state;
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
/**
 * ## 「通道」`Ex.yoFormEdit`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 该方法近似于`yoList`，但该属性集是传递给表单，附带了表单属性集。
 *
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||Function|rxClose|关闭表单容器专用回调方法。|
 * |构造||Function|rxView|读取数据记录专用回调方法。|
 * |构造||Function|doSubmitting|表单防重复加载设置提交状态专用方法。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |||String|$mode|固定值"EDIT"。|
 * |options|state|Object|$identifier|当前列表的配置数据，从配置数据中抽取配置项：`identifier`。|
 * |plugins|state|Object|$plugins|为子表单计算`pluginField`字段控制专用函数，并且计算`pluginRow`（转换成`pluginForm`）控制函数。|
 * |$query|props|Object|$query|当前列表的查询条件，处理特殊条件专用。|
 * |$inited|state|Object|$inited|编辑表单初始化数据专用。|
 * |$rowData|state|Object|$record.rowData|子表单中DialogEditor专用行选中记录信息。|
 *
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于模型标识符
 *
 * 该方法在内部使用，为静态标识符，所以只支持静态模式下的identifier模型标识符读取，不从远程获取，
 * 远程获取会在`OxList`组件中完成，而不是`ExListXxx`组件中。
 *
 * #### 3.2. 关于插件
 *
 * `pluginRow`插件在表单中本身作为了行控制，所以内置子表单的字段控制直接设置成该函数
 *
 * * 如果列表中数据不可编辑，那么表单中的数据不可编辑（只读）。
 * * 如果列表中数据不可删除，那么表单中的数据不可删除。
 *
 * > 编辑/删除两种操作在列表和表单中维持一致性。
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @param {Object} item 当前打开以前配置，页签`key`就是记录主键。
 * @returns {Object} 传入编辑子表单的属性集
 */
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

/**
 * ## 「通道」`Ex.yoListSearch`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * > *: 这个函数和其他`yoList`有一定区别，主要在属性构造上。
 *
 * 基础搜索/高级搜索工具栏专用，基本逻辑类似于`yoFormAdd/yoFormEdit`，提供给查询表单用的属性集。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |options|state|Object|$options|当前组件构造的options选项信息，直接继承。|
 * |$filters|state|Object|$inited|「主条件」根据条件数据构造高级搜索表单的初始化数据。|
 * |$filtersRaw|state|Object|$inited|「辅助条件」根据条件数据构造高级搜索表单的初始化数据，配置化特殊情况专用。|
 * |构造||Object|config|从options中直接抽取`search`打头的选项。|
 * |构造||Boolean|$disableClear|是否禁止清空按钮，如果没有条件则禁用该按钮。|
 * |构造||Function|rxFilter|构造查询条件，双参，同时修改主条件和辅助条件，查询表单提交用。|
 * |$form|props|Object|$form|传入基础配置`key = Jsx`的表单元素哈希表，后期根据键值抽取表单。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于搜索模式
 *
 * 搜索模式可以通过`search.enabled`和`search.advanced`两个选项来执行开启和禁用：
 *
 * 1. `search.enabled`：启用基础搜索（搜索框）。
 * 2. `search.advanced`：启用高级搜索（搜索表单）。
 *
 * #### 3.2. 查询条件
 *
 * 影响`ExListXxx`的条件有三个状态值：`$filters, $condition, $query`：
 *
 * * $query：主条件，包括从外置传入的条件
 * * $condition：列过滤专用条件
 * * $filters：当前组件操作的条件（基础搜索和高级搜索）
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} 工具栏消费专用的属性集。
 */
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
/**
 * ## 「通道」`Ex.yoListOpen`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理Open区域按钮操作，所有的`ExListXxx`组件共享，主要包含：基础配置：`op.open` + 扩展配置：+ `op.extension`，其中 op.extension 中的配置如：
 *
 * ```
 * {
 *     region: "op.open.xxx"
 * }
 * ```
 *
 * ### 2. 构造属性表
 *
 * （无）
 *
 * ### 3. 核心
 *
 * #### 3.1. 清除
 *
 * 针对`op.open.filter`执行查询条件清除按钮的禁用和启用提示，如果执行了列过滤，则启用该按钮，如果未执行，则不启用该按钮，根据`$condition`来。
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} button.config中保存了所有按钮信息
 */
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
    attrs.config = yoExtension(reference, "op.open", attrs.config);
    return attrs;
}
/**
 * ## 「通道」`Ex.yoListBatch`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理Batch区域按钮操作，所有的`ExListXxx`组件共享，主要包含：基础配置：`op.batch` + 扩展配置：+ `op.extension`，其中 op.extension 中的配置如：
 *
 * ```
 * {
 *     region: "op.batch.xxx"
 * }
 * ```
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |||String|$category|固定值，按钮类型，`LINK | BUTTON`两种，此处为`LINK`。|
 * |构造||Function|doSubmitting|表单防重复加载设置提交状态专用方法。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |构造||Function|rxBatchEdit|批量编辑所需的外层函数，设置选中状态专用。|
 * |$columns|state|Array|（内嵌）|「动态」批量编辑`op.batch.edit`专用配置，编辑表单读取属性用。|
 * |$columnsMy|state|Array|（内嵌）|「动态」批量编辑`op.batch.edit`专用配置，编辑表单读取属性配置用。|
 * |$selected|state|Array|$selected|已选中的项数据列表。|
 * |$submitting|state|Boolean|$submitting|防重复提交的基础提交状态。|
 * |构造||Array|config|按钮专用配置构造函数，构造两部分：基础 + 扩展，包括选择未选中的状态计算。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于选中
 *
 * 批量操作启用时，`<Table/>`中会根据批量操作种类设置多选框，一旦有一个操作合法则会提供多选框，
 * 多选框操作变量为`$selected`，它为批量操作提供了数据选中依据，为了防止用户选错，当任何选项都未选中时，
 * 批量操作会被禁用。
 *
 * #### 3.2. 关于编辑
 *
 * 批量编辑是Zero Ui提供的固定功能，`op.batch.edit`，该功能会根据当前记录的列信息和视图信息（`columnFull/columnMy`）来计算
 * 最终可编辑的属性表，属性信息支持不同种类，其控件内容也不同。
 *
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} button.config中保存了所有按钮信息
 */
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
/**
 * ## 「通道」`Ex.yoListExtra`
 *
 * > 优先读取`Ex.yoAmbient`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理Extra区域按钮操作，所有的`ExListXxx`组件共享，主要包含：基础配置：`op.extra` + 扩展配置：+ `op.extension`，其中 op.extension 中的配置如：
 *
 * ```
 * {
 *     region: "op.extra.xxx"
 * }
 * ```
 *
 * > 关于 `$columns/$columnsMy` 的注入，这个区域也会需要，但由于数据结构不同，而一直没有出问题，这部分暂时不执行代码合并。重复代码部分如：
 *
 * ```js
 *      editorRef.config.forEach((config = {}) => {
 *
 *          const {component = {}} = config;
 *          const editorRef = component.config;
 *
 *          editorRef.$columns = $columns;
 *          editorRef.$columnsMy = $columnsMy;
 *      });
 * ```
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||Function|doSubmitting|表单防重复加载设置提交状态专用方法。|
 * |构造||Function|doDirty|设置当前列表的`$dirty = true`，通常在配置中才使用。|
 * |构造||Function|rxColumnSave|保存我的视图专用方法，可创建我的`列视图`。|
 * |构造||Function|rxExport|导出数据按钮专用。|
 * |构造||Function|rxImport|导入数据专用按钮。|
 * |构造||Function|rxProjection|设置`projection`列视图专用方法，选择了列视图过后，可设置当前列表显示那些列信息。|
 * |$columns|state|Array|（内嵌）|我的视图列。|
 * |$columnsMy|state|Array|（内嵌）|模型全列。|
 *
 *
 * ### 3. 核心
 *
 * #### 3.1. 关于列视图
 *
 * 列视图在构造过程中层次如下：
 *
 * ```
 * |-------------------------------------------- 全列 |
 * |--------------------------------------     业务列 |
 * |------------------------------ ACL控制      可见列 |
 * |------------------------ 保存               视图列 |
 * ```
 *
 * 最终关系：
 *
 * 1. 全列 = 系统列（不可见） + 业务列（可见）
 * 2. 业务列 = ACL可见（$columns） + ACL不可见（权限控制列）
 * 3. ACL可见列 = 我的视图列（$columnsMy） + 视图未选中列
 *
 * #### 3.2. 三个基础函数
 *
 * 该函数会构造三个核心函数，对应三个系统按钮
 *
 * |按钮代码|函数|含义|
 * |:---|:---|:---|
 * |op.extra.column|rxProjection|设置选中列，未保存之前刷新后失效，如果保存了下一次生效。|
 * |op.extra.export|rxExport|导出数据专用按钮。|
 * |op.extra.import|rxImport|导入数据专用按钮。|*
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用，此处一般表示当前`ExListXXX`组件。
 * @returns {Object} button.config中保存了所有按钮信息
 */
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
     * ## 「通道」`Ex.yoComponent`
     *
     * `yoAmbient`函数对应的别名函数，代码逻辑一模一样，`yoAmbient`等价函数。
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

    yoTabPage,              // Tab页签
    yoTabExtra,         // Tab页 Extra 区域

    yoFormAdd,          // 添加表单
    yoFormEdit,         // 编辑表单

    yoListSearch,       // 搜索区域
    yoListOpen,         // 打开区域
    yoListBatch,        // 批量区域
    yoListExtra,        // 额外区域
}