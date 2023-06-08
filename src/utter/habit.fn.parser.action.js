import Ux from "ux";
import I from './levy.c.api.interface';
import __VOP from './habit.__.v.option.op';
import __V from "./pedestal.v.constant.option";
import __RX from './idyl.zero.dependency';
// =====================================================
// parserOfButton
// =====================================================

const __async = (result, async = true) => {
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
const __parsePlugin = (buttons = {}, options = {}) => {
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
const __parseContainer = (component = {}, plugin = {}, options = {}) => {
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
const __parseComponent = (buttons = {}, options = {}, components = {}) => {
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
                component = __parseContainer(component, plugin, options);
            }
            return component;
        }
    }, 'component');
    return buttons;
};
const __parseControl = (config = [], options = {}) => {
    const {type} = options;
    if (Ux.Env.TYPE_CONTROL.LIST === type) {
        const {ops = []} = options;
        if (config.options) {
            ops.forEach(op => {
                const item = {};
                item.key = op['clientKey'];
                config.options[item.key] = op['text'];
            });
        }
    } else if (Ux.Env.TYPE_CONTROL.FORM === type) {
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
const __parseOp = (config = [], options = {}, reference) => new Promise((resolve) => {
    if (options[__V.Opt.DYNAMIC_OP]) {
        /*
         * 动态 Op
         */
        const identifier = options.identifier;
        if (identifier) {
            /*
             * 特殊权限
             */
            I.ops({identifier, type: Ux.Env.TYPE_OP.OP})
                /* 处理核心 List 问题 */
                .then(response => Ux.promise(Ux.aclOp(options, response)))
                /* op.extension */
                .then(processed => {
                    /* 静态 Op */
                    const opts = Ux.clone(options);
                    /* `op.` 打头的操作直接过滤 */
                    Object.keys(opts)
                        .filter(opKey => opKey.startsWith('op.extension'))
                        .forEach(opKey => processed[opKey] = opts[opKey]);
                    resolve(processed)
                })
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
        .filter(opKey => __VOP.hasOwnProperty(opKey))
        .forEach(opKey => {
            const button = Ux.clone(__VOP[opKey]);
            button.id = button.key;                     // 前后端主键同步
            const inputText = options[opKey];
            if (inputText !== ops[opKey]) {
                button.text = inputText;
            } else {
                button.text = ops[opKey];
            }
            // 扩展配置
            const plugin = options[`${opKey}.plugin`];
            if (!button.plugin) button.plugin = {};      // 插件
            if (plugin) {
                Object.assign(button.plugin, plugin);
            }
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
                    onClick = () => {
                        Ux.of(reference).submitting().handle(() => {

                            Ux.connectId(config.connectId);
                        })
                        // reference.?etState({$submitting: true});
                        // Ux.connectId(config.connectId);
                    };
                } else {
                    console.warn("onClick 注入失败", config);
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
 * 权限控制专用解析
 */
const __parseAuthorized = (reference, buttons = {}, options = {}) => {
    // TODO: 权限控制
    /*
     * Open区域
     * Batch区域
     * Search区域
     * Extra区域
     * Row区域
     */
    // console.error(buttons, options);
    return Ux.promise(buttons);
};
/*
 * 事件处理专用解析
 */
const __parseEvent = (reference, buttons = {}) => {
    const {$op = {}} = reference.props;
    const combineFn = (config = {}, inputFn) => {
        const {plugin} = config;
        if (plugin['beforeFn'] && Ux.isFunction($op[plugin['beforeFn']])) {
            const executor = $op[plugin['beforeFn']](reference);
            if (Ux.isFunction(executor)) {
                return event => {
                    return executor(event).then(() => inputFn())
                };
            } else {
                return inputFn;
            }
        } else {
            return inputFn;
        }
    }
    /* 添加页签 */
    if (buttons.hasOwnProperty('op.open.add')) {
        const configRef = buttons['op.open.add'];
        configRef.onClick = combineFn(configRef, __RX.rxTabAdd(reference));
    }
    /* 清除 $condition */
    if (buttons.hasOwnProperty('op.open.filter')) {
        // const configRef = buttons['op.open.filter'];
        // configRef.onClick = __RX.?xCondition(reference, true);
        delete buttons['op.open.filter'];       // 新版移除
    }
    /* 批量删除 */
    if (buttons.hasOwnProperty('op.batch.delete')) {
        const configRef = buttons['op.batch.delete'];
        configRef.onClick = __RX.rxBatchDelete(reference);
    }
    return Ux.promise(buttons);
};
/*
 * 统一配置解析器
 */
export default {
    parserOfButton: (reference) => ({
        parsePlugin: (buttons = {}, options = {}, async = true) => __async(__parsePlugin(buttons, options), async),
        parseComponent: (buttons = {}, options = {}, component = {}, async = true) => __async(__parseComponent(buttons, options, component), async),
        parseControl: (config = [], options = {}, async = true) => __async(__parseControl(config, options), async),
        parseOp: (config = [], options = {}) => __parseOp(config, options, reference)
    }),
    /**
     * ## 「解析」`Ex.parserOfEvent`
     *
     * @memberOf module:parser/utter
     * @param reference
     * @returns {*}
     */
    parserOfEvent: (reference) => ({
        parseAuthorized: (buttons = {}, options) => __parseAuthorized(reference, buttons, options),
        parseEvent: (buttons = {}, options) => __parseEvent(reference, buttons, options)
    })
}