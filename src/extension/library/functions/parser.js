import Ux from "ux";
import Gb from "./global";
import I from "../ajax";

// =====================================================
// 常量定义信息
// =====================================================
const vOp = {
    /*
     * 关于 plugin 的说明
     * 1）tooltip：启用 <Tooltip/> 的外围功能
     * 2）confirm：点击按钮会有 弹出框提示 Modal.confirm
     * 3）「中间行为」window：直接使用弹出框 Modal，打开一个窗口
     * 4）「中间行为」popover：直接使用 <Popover/>，打开一个浮游面板
     * 5）「中间行为」drawer：直接使用 <Drawer/>，打开一个抽屉
     * 6）「中间行为」connect：直接调 Ux.connectId 连接点击
     * 7）submit：是否启用防重复提交
     */
    "op.open.add": {
        icon: 'plus',
        type: 'primary',
        key: 'opAdd'
    },
    "op.open.filter": {
        icon: 'delete',
        type: 'default',
        key: 'opFilter',
        plugin: {
            tooltip: true,
            confirm: "confirm.clean.filter"
        }
    },
    "op.batch.edit": {
        icon: 'edit',
        type: 'default',
        key: 'opBatchEdit',
        plugin: {
            window: 'window.batch.editor',    // Window专用
            componentType: 'ExEditorBatch',     // 组件类型
            component: `batch.editor`,   // 配置专用Key
        }
    },
    "op.batch.delete": {
        icon: 'delete',
        type: 'default',
        key: 'opBatchDelete',
        plugin: {
            prompt: 'confirm.batch.delete',    // 配置confirm
        }
    },
    "op.extra.column": {
        icon: 'caret-down',
        type: 'primary',
        key: 'opColumn',
        plugin: {
            tooltip: true,
            popover: 'window.extra.column',     // Popover 专用
            componentType: 'ExEditorColumn',        // 组件类型
            component: 'extra.column'
        }
    },
    "op.extra.view": {
        key: 'opView',
        type: 'default',
        icon: 'double-left',
        className: 'ux-spec',
        plugin: {
            tooltip: true,
            drawer: 'window.extra.view',     // Popover 专用
            componentType: 'ExEditorView',        // 组件类型
            component: 'extra.view'
        }
    },
    'op.extra.export': {
        icon: 'export',
        key: 'opExport',
        plugin: {
            tooltip: true,
            window: 'window.extra.export',      // Window专用
            componentType: 'ExEditorExport',
            component: 'extra.export'
        }
    },
    'op.extra.import': {
        icon: 'import',
        key: 'opImport',
        plugin: {
            tooltip: true,
            window: 'window.extra.import',      // Window专用
            componentType: 'ExEditorImport',
            component: 'extra.import'
        }
    },
    'op.submit.add': {
        icon: 'plus',
        key: 'opFormAdd',
        type: 'primary',
        plugin: {
            submit: true,
            connect: 'id.submit.add'
        }
    },
    'op.submit.save': {
        icon: 'save',
        key: 'opFormSave',
        type: 'primary',
        plugin: {
            submit: true,
            connect: 'id.submit.save'
        }
    },
    'op.submit.delete': {
        icon: 'delete',
        key: 'opFormDelete',
        type: 'danger',
        plugin: {
            submit: true,
            tooltip: true,
            prompt: 'confirm.delete',
            connect: 'id.submit.delete'
        }
    },
    'op.submit.reset': {
        icon: 'redo',
        key: 'opFormReset',
        type: 'default',
        plugin: {
            tooltip: true,
            connect: 'id.submit.reset'
        }
    }
}

// =====================================================
// parserOfButton
// =====================================================

const toAsync = (result, async = true) => {
    if (async) {
        if (Promise.prototype.isPrototypeOf(result)) {
            /* 本身异步 */
            return result.then(response => Ux.promise(response))
        } else {
            /* 本身同步 */
            return Ux.promise(result);
        }
    } else {
        return result;
    }
};
/*
 * 传入的 ops 必须是一个对象，每个 key 都会最终生成 category 属性
 */
const parsePlugin = (buttons = {}, options = {}) => {
    Ux.itValue(buttons, (button = {}) => {
        const {plugin = {}} = button;
        const configuration = {};
        /* 启用 tooltip 的button专用 */
        if (plugin.tooltip) {
            configuration.tooltip = true;
        }
        /* 启用 confirm 功能 */
        if (plugin.confirm) {
            configuration.confirm = options[plugin.confirm];
        }
        /* 启用 prompt 功能 */
        if (plugin.prompt) {
            configuration.prompt = options[plugin.prompt];
        }
        /* 启用 connect 功能 */
        if (plugin.connect) {
            configuration.connect = options[plugin.connect];
        }
        /* 启用 message 功能 */
        if (plugin.message) {
            configuration.message = options[plugin.message];
        }
        return configuration;
    }, 'plugin');
    return buttons;
};
const _parseContainer = (component = {}, plugin = {}, options = {}) => {
    /* 连接 window, confirm, popover, drawer */
    if (plugin.window) {
        component.type = "WINDOW";
        const literal = options[plugin.window];
        component.dialog = Ux.aiExprWindow(literal);
    } else if (plugin.popover) {
        component.type = "POPOVER";
        const literal = options[plugin.popover];
        component.dialog = Ux.aiExprPopover(literal);
    } else if (plugin.drawer) {
        component.type = "DRAWER";
        const literal = options[plugin.drawer];
        component.dialog = Ux.aiExprDrawer(literal);
    } else {
        component.type = "NONE";
    }
    return component;
};
const parseComponent = (buttons = {}, options = {}, components = {}) => {
    Ux.itValue(buttons, (button = {}) => {
        const Jsx = components.plugin;
        const config = components.config;
        if (Jsx && config) {
            const {plugin = {}} = button;
            let component;
            if (plugin.componentType) {
                /* 初始化组件配置 */
                component = {
                    component: Jsx[plugin.componentType]
                };
                if (config.hasOwnProperty(plugin.component)) {
                    component.config = config[plugin.component];
                } else {
                    component.config = {};
                }
                /*
                 * component合法
                 */
                component = _parseContainer(component, plugin, options);
            }
            return component;
        }
    }, 'component');
    return buttons;
};
const parseControl = (config = [], options = {}) => {
    const {type} = options;
    if ("LIST" === type) {
        const {ops = []} = options;
        if (config.options) {
            ops.forEach(op => {
                const item = {};
                item.key = op['clientKey'];
                config.options[item.key] = op['text'];
            });
        }
    } else if ("FORM" === type) {
        const {ops = []} = options;
        if (config.form) {
            const op = {};
            const event = {};
            ops.forEach(each => {
                // 先嫁接 op
                op[each['clientKey']] = each['action'];
                event[each['clientKey']] = {
                    event: each.event,
                    config: each.config ? each.config : {}
                };  // 处理 event
            });
            config.form.op = op;
            // event 专用信息
            if (!Ux.isEmpty(event)) {
                config.event = event;
            }
        }
    }
    return config;
};
/*
 * 这里的 options 执行合并
 * options + state.options 构造新的 options实现
 */
const parseOp = (config = [], options = {}, reference) => new Promise((resolve) => {
    if (options[Gb.Opt.DYNAMIC_OP]) {
        /*
         * 动态 Op
         */
        const identifier = options.identifier;
        if (identifier) {
            /*
             * 特殊权限
             */
            I.ops({identifier, type: "OP"})
                /*
                 * 处理核心 List 问题
                 */
                .then(response => resolve(Ux.aclOp(options, response)))
        } else {
            /*
             * 无权限配置
             */
            console.error("对不起，没有合法的 identifier，无法读取权限！");
            resolve({});
        }
    } else {
        /* 静态 Op */
        const opts = Ux.clone(options);
        /* `op.` 打头的操作直接过滤 */
        const ops = {}
        Object.keys(opts)
            .filter(opKey => opKey.startsWith('op.'))
            .forEach(opKey => ops[opKey] = opts[opKey]);
        resolve(ops);
    }
}).then((ops = {}) => {
    /*
     * 基础按钮转换处理
     */
    const buttons = {};
    Object.keys(ops)
        .filter(opKey => !!opKey)
        .filter(opKey => "string" === typeof opKey)
        .filter(opKey => vOp.hasOwnProperty(opKey))
        .forEach(opKey => {
            const button = Ux.clone(vOp[opKey]);
            button.id = button.key;                     // 前后端主键同步
            button.text = ops[opKey];
            if (!button.plugin) button.plugin = {};      // 插件
            button.category = opKey;
            buttons[opKey] = button;
        });

    /*
     * 扩展OP专用：op.extension
     */
    const {$op = {}} = reference.props;
    Object.keys(ops)
        .filter(opKey => !!opKey)
        .filter(opKey => "string" === typeof opKey)
        .filter(opKey => opKey.startsWith('op.extension'))
        .forEach(opKey => {
            /*
             * 执行区域专用
             * 1. 带有 connectId
             * 2. 带有 executor
             * 这里只需要执行 onClick 注入就可以
             */
            const op = Ux.clone(ops[opKey]);
            const {config = {}} = op;
            if (config.executor || config.connectId) {
                /*
                 * 执行 onClick 函数级别的操作
                 * 1. 第一种是直接构造 executor 级别
                 * 2. 第二种是 connectId 注入
                 */
                let onClick;
                if (config.executor) {
                    const onClickFn = $op[config.executor];
                    if (Ux.isFunction(onClickFn)) {
                        onClick = onClickFn(reference, Ux.clone(config))
                    }
                } else if (config.connectId) {
                    onClick = () => Ux.connectId(config.connectId);
                }
                if (Ux.isFunction(onClick)) {
                    op.onClick = onClick;
                }
            }
            buttons[opKey] = op;
        });
    return Ux.promise(buttons);
})
/*
 * 统一配置解析器
 */
export default {

    /**
     * ## 「解析」`Ex.parserOfButton`
     *
     * ### 1. 基本介绍
     *
     * 生成按钮专用解析器，返回对象结构如（每个键都是函数）：
     *
     * ```js
     * {
     *     parsePlugin: () => "按钮插件解析函数",
     *     parseComponent: () => "组件解析函数",
     *     parseControl: () => "按钮本身解析函数，解析不同组件专用，LIST, FORM 不同",
     *     parseOp: () => "解析按钮本身专用方法",
     * }
     * ```
     *
     * |函数名|异步|同步|含义|
     * |:---|---|---|:---|
     * |parsePlugin|o|o|插件解析专用。|
     * |parseComponent|o|o|组件解析专用。|
     * |parseControl|o|o|控件解析专用。|
     * |parseOp|o|x|操作按钮解析专用。|
     *
     * ### 2. 子函数解析
     *
     * #### 2.1. parsePlugin（解析Object）
     *
     * **入参表**
     *
     * |参数名|类型|含义|
     * |:---|---|:---|
     * |buttons|Object|全按钮配置，`key = Object`结构。|
     * |options|Object|列表/组件的专用配置`options`结构。|
     * |async|Boolean|是否执行异步模式。|
     *
     * 插件解析主要处理`Object`的按钮专用，处理每个元素（Object类型）的配置信息，它用来处理按钮的某些功能。
     * button元素中有关此函数的数据结构如下：
     *
     * ```js
     * {
     *     plugin:{
     *         tooltip: "...",
     *         confirm: "...",
     *         prompt: "...",
     *         connect: "...",
     *         message: "..."
     *     }
     * }
     * ```
     *
     * **配置项**
     *
     * |配置项|类型|表达式|含义|
     * |:---|---|:---|:---|
     * |tooltip|Boolean||启用tooltip功能，直接设置`tooltip=true`来打开`<Tooltip/>`，按钮外围浮游提示信息。|
     * |confirm|String|options[confirm]|执行`Modal.confirm`功能，弹出提示框确认/取消。|
     * |prompt|String|options[prompt]|实现浮游提示确认/取消框。|
     * |connect|String|options[connect]|配置被链接的操作元素ID，最终会调用`Ux.connectId`触发该元素的onClick事件。|
     * |message|String|options[message]|需要使用的文本信息。|
     *
     * #### 2.2. parseComponent（解析Object）
     *
     * **入参表**
     *
     * |参数名|类型|含义|
     * |:---|---|:---|
     * |buttons|Object|全按钮配置，`key = Object`结构。|
     * |options|Object|列表/组件的专用配置`options`结构。|
     * |component|Object|动态组件配置信息。|
     * |async|Boolean|是否执行异步模式。|
     *
     * 组件解析主要处理`Object`中按钮配置专用，`component`（第三参）中的结构如：
     *
     * ```js
     * {
     *     plugin: "Jsx元素集合，里面包含了所有可读取的组件信息。",
     *     config: "Jsx元素所需的配置数据。"
     * }
     *
     * // 抽取配置代码如下
     * const Jsx = components.plugin;
     * const config = components.config;
     * ```
     *
     * > 只有`plugin`和`config`有值或存在时才执行解析流程！！
     *
     * 按钮配置中会存在如下数据结构：
     *
     * ```js
     * {
     *     plugin: {
     *         componentType: "",
     *         component: ""
     *     }
     * }
     * ```
     *
     * **配置项**
     *
     * |配置项|类型|表达式|含义|
     * |:---|---|:---|:---|
     * |componentType|String|Jsx[componentType]|用于读取Jsx元素|
     * |component|String|config|component]|用于读取配置数据|
     *
     * 注入完成了组件的Jsx元素和配置数据过后，就会调用`_parseContainer`方法执行外层容器元素信息，容器元素
     * 主要由按钮元素的plugin决定：
     *
     * ```js
     * {
     *     plugin:{
     *         window: "弹出窗口",
     *         popover: "浮游窗口",
     *         drawer: "抽屉窗口"
     *     }
     * }
     * ```
     *
     * 构造的配置数据结构如下：
     *
     * ```js
     * {
     *     type: "窗口类型",
     *     dialog: "解析的窗口配置"
     * }
     * ```
     *
     * 完整配置表格如下：
     *
     * |待解析节点|生成type|调用函数生成dialog|
     * |:---|---|:---|
     * |window|WINDOW|Ux.aiExprWindow|
     * |popover|POPOVER|Ux.aiExprPopover|
     * |drawer|DRAWER|Ux.aiExprDrawer|
     * |三者都无|NONE|`<无dialog节点>`|
     *
     * 该函数最终生成的完整配置表如下：
     *
     * ```js
     * {
     *     component: "Jsx元素"，
     *     config: "组件配置数据",
     *     type: "「容器」窗口类型",
     *     dialog: "「容器」窗口配置"
     * }
     * ```
     *
     * #### 2.3. parseControl（解析Array）
     *
     * **入参表**
     *
     * |参数名|类型|含义|
     * |:---|---|:---|
     * |config|Array|控件配置队列。|
     * |options|Object|解析控件时的辅助配置信息。|
     * |async|Boolean|是否执行异步模式。|
     *
     * 该方法主要用于控件的动态配置，从远程读取`UI_CONTROL`表中的配置数据，再配合控件类型以及操作列表组合成最终用于
     * Jsx元素的控件属性相关信息。直接从第二参中读取`type`配置参数，该参数目前版本支持（`LIST`-列表配置，`FORM`-表单配置）。
     *
     * 第一个参数为`config`对象：
     *
     * 1. 「LIST」如果存在`config.options`，则可以为该对象注入`clientKey`的客户端配置。
     * 2. 「FORM」如果存在`config.form`，则重新构造`config.form.op`（该配置会影响表单中的操作，包括ACL信息），构造操作信息的同时，系统会构造`event`事件信息，并且注入到`config.event`中，该值会被`Fabric`引擎使用。
     *
     * #### 2.4. parseOp（解析Array）
     *
     * > 该方法不带异步参数，不支持同步模式。
     *
     * **入参表**
     *
     * |参数名|类型|含义|
     * |:---|---|:---|
     * |config|Array|按钮配置队列。|
     * |options|Object|解析操作时的辅助配置信息。|
     *
     * 该方法主要用于`ExListXX`组件解析组件操作用，目前执该流程的组件主要是：`ExListOpen / ExListComplex / ExListQuery`。
     *
     * 1. 先根据options中的配置`dynamic.op`进行分流操作，如果为true则直接远程读取按钮配置信息，如果为false则直接使用资源文件中的配置。
     * 2. 先执行基础按钮的规范化操作，包括带plugin的按钮配置解析操作。
     * 3. 执行完成后，追加`op.extension`的扩展按钮操作（options中以`op.extension`为前缀的选项）：
     *      1. 如果`op.config`中包含`executor`，则执行直接按钮扩展，从props的`$op`对象中构造（纯开发）。
     *      2. 如果`op.config`中只包含`connectId`属性，则该按钮操作直接绑定onClick生成`Ux.connectId`的锚点。
     *
     * `op.extension`扩展配置片段如：
     *
     * ```json
     *      "op.extension.confirm": {
     *          "text": "确认单据",
     *          "icon": "checked",
     *          "className": "ux-spec",
     *          "region": "op.tab.confirm",
     *          "plugin": {
     *              "tooltip": true
     *          },
     *          "config": {
     *              "connectId": "$opFinish",
     *              "index": 1
     *          }
     *      },
     * ```
     *
     * 关于扩展按钮的解析最终会调用`yoExtension`内置函数（不开放）执行解析，该函数的逻辑会在`yo`方法中说明，
     * 上述规范化操作完成后，整个按钮部分的配置程序就执行完成，规范化的结果会存储在state中。
     *
     * ### 3. 总结
     *
     * `parserOfButton`方法执行后，会生成一个带四个子函数的核心对象，这四个子函数主要做按钮级别的配置规范化操作。
     *
     * @memberOf module:_kernel
     * @method parserOfButton
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Object}
     */
    parserOfButton: (reference) => ({
        parsePlugin: (buttons = {}, options = {}, async = true) => toAsync(parsePlugin(buttons, options), async),
        parseComponent: (buttons = {}, options = {}, component = {}, async = true) => toAsync(parseComponent(buttons, options, component), async),
        parseControl: (config = [], options = {}, async = true) => toAsync(parseControl(config, options), async),
        parseOp: (config = [], options = {}) => parseOp(config, options, reference)
    }),


    /**
     * ## 「解析」`Ex.parserOfColor`
     *
     * ### 1. 基本介绍
     *
     * 生产日志器专用解析器，返回不同日志器记录日志（每个键都是函数）：
     *
     * ```js
     * {
     *     private: () => "私有组件",
     *     form: () => "表单组件",
     *     list: () => "列表专用",
     *     action: () => "操作组件",
     *     tpl: () => "模板",
     *     component: () => "通用组件",
     *     container: () => "容器组件",
     *     page: () => "页面组件",
     *     type: () => "分类处理",
     *     control: () => "控件",
     *     dynamic: () => "动态组件",
     *     view: () => "视图组件",
     *     define: () => "定义组件"
     * }
     * ```
     *
     * ### 2. 日志函数作用规范
     *
     * |函数名|日志组件|
     * |:---|:---|
     * |private|私有组件。|
     * |form|表单组件专用`<Form/>`。|
     * |list|列表组件专用`<ExListXXX/>`。|
     * |action|操作按钮专用，通常在列表操作组件中使用。|
     * |tpl|模板组件专用。|
     * |component|公有组件专用。|
     * |container|容器组件专用。|
     * |page|页面组件专用。|
     * |type|「保留」分类组件专用。|
     * |control|自定义控件专用。|
     * |dynamic|动态组件专用。|
     * |view|视图组件专用。|
     * |define|自定义组件专用。|
     *
     * @memberOf module:_kernel
     * @method parserOfColor
     * @param {String} name 组件名称
     * @returns {Object}
     * */
    parserOfColor: (name = "") => ({
        private: (state = {}) => ({name, color: "#CD9B1D", ...state}), // 私有组件
        // extension 部分
        form: (state = {}) => ({name, color: "#6959CD", ...state}),    // 表单
        list: (state = {}) => ({name, color: "#104E8B", ...state}),    // 列表
        action: (state = {}) => ({name, color: "#009ACD", ...state}),  // 操作（按钮类）
        tpl: (state = {}) => ({name, color: "#93c", ...state}),     // 模板
        component: (state = {}) => ({name, color: "#228B22", ...state}),     // 公有组件
        // 非 extension 部分
        container: (state = {}) => ({name, color: "#1C86EE", ...state}),    // 容器
        page: (state = {}) => ({name, color: "#1874CD", ...state}),         // 页面
        type: (state = {}) => ({name, color: "#4F94CD", ...state}),
        control: (state = {}) => ({name, color: "#2E8B57", ...state}),          // 自定义组件
        dynamic: (state = {}) => ({name, color: "#8B6914", ...state}),          // 动态
        view: (state = {}) => ({name, color: "#CDAD00", ...state}),          // 动态
        define: (state = {}) => ({name, color: "#7CCD7C", ...state}),               // 用户自定义
    })
}