import Eng from "./engine";
import Abs from "./abyss";
import Ajx from './ajax';
import T from './unity';

import {DialogButton} from "web";
import React from "react";
import {message, Modal} from "antd";

/**
 * ## 内部私有函数「Zero」
 *
 * 该方法会读取配置数据，在资源文件中如`UI.json`会包含如下数据：
 *
 * ```json
 * {
 *     "_model": {},
 *     "_dialog": {
 *         "...": "该配置在 shared.json 中已经包含"
 *     }
 * }
 * ```
 *
 * 该配置主要读取模态窗口专用配置而存在，并且执行不同层级的读取，最终生成：
 *
 * ```json
 * {
 *     "type": "窗口类型",
 *     "title": "窗口标题",
 *     "content": "窗口内容"
 * }
 * ```
 *
 * 返回的结果可直接被 antd 中的 `Modal` 组件消费。
 *
 * @memberOf module:__private
 * @param {ReactComponent} reference React组件引用
 * @param {String} key 将要读取的键值
 * @return {any} 返回最终读取到的数据
 */
const cabModal = (reference, key) => {
    const modal = Eng.fromHoc(reference, "modal");
    const seek = {};
    if (Abs.isObject(modal)) {
        const title = Eng.fromHoc(reference, "dialog");
        Object.keys(modal).forEach(type => {
            /*
             * 检查
             */
            const config = modal[type];
            if (Abs.isObject(config)) {
                if (config.hasOwnProperty(key)) {
                    seek.type = type;
                    seek.content = config[key];
                    if (title) {
                        /*
                         * 标题信息
                         */
                        seek.title = title[type];
                    }
                }
            }
        });
    }
    return seek;
};

const _sexBatchState = (reference, callback, config) => {
    /*
     * 1. 先检索 state 中是否包含了 $selected
     * 2. 再检索 props 中是否包含了 $selected
     */
    const $selected = reference.state ? reference.state.$selected : null;
    const {options = {}} = reference.state;
    const {
        name = "",          // 日志专用名称
        reset = true,       // 默认清空 $selected
        message = "",       // message Key（从 options 中读取 message）
    } = config;
    if (0 < $selected.length) {
        reference.setState({
            $loading: true,     /* 当前组件中的状态设置 $loading = true */
            $submitting: true,     // 防重复提交
        });
        return callback($selected).then(Ajx.ajax2True(() => {
            /*
             * 处理
             * $dirty, $loading, $submitting
             */
            const state = {
                $dirty: true,           // 脏效果
                $loading: false,        // 加载效果
                $submitting: false,     // 防重复提交
            };
            if (reset) {
                /*
                 * 删除的时候使用
                 */
                $selected.splice(0, $selected.length);
                state.$selected = [];
            }
            /*
             * 继承模式
             */
            reference.setState(state);
        }, options[message] ? options[message] : message))
    } else {
        throw new Error(`[ Ux ] 选择项丢失！${name}`);
    }
};
const doSubmit = (reference, submitting = true) => {
    /*
     * 提交处理
     */
    const {doSubmitting} = reference.props;
    if (Abs.isFunction(doSubmitting)) {
        doSubmitting(submitting);
    }
};
const doClose = (reference, $selected = []) => {
    doSubmit(reference, false);
    const {rxClose, doDirty} = reference.props;
    if (Abs.isFunction(rxClose)) {
        rxClose();
    }
    if (Abs.isFunction(doDirty)) {
        doDirty(true, {$selected});
    }
};
const _sexBatchProp = (reference, callback, config = {}) => {
    const {$selected = []} = reference.props;
    const {
        name = "",          // 日志专用名称
        reset = true,
        message = "",       // message Key（从 options 中读取 message）
    } = config;
    if (0 < $selected.length) {
        /*
         * 提交处理
         */
        doSubmit(reference);
        /*
         * 调用外层的 rxBatchEdit 函数
         */
        return callback($selected).then(Ajx.ajax2True(() => {
            /*
             * $submitting = false
             */
            doClose(reference, reset ? [] : $selected);
        }, message))
    } else {
        throw new Error(`[ Ux ] 选择项丢失！${name}`);
    }
};
/**
 * ## 「引擎」`Ux.sexBatch`
 *
 * 批量专用函数，用于处理批量按钮的特殊配置提取（同时从 props 属性和 state 状态中提取数据），内部调用代码如：
 *
 * ```js
 *
 * // 专用的批量处理按钮设置器。
 * const rxBatchEdit = (reference) => (params = []) => Ux.sexBatch(reference, ($selected = []) => {
 *      const {options = {}} = reference.state;
 *      const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
 *      return Ux.ajaxPut(uri, params);
 * }, {name: "rxBatchEdit", reset: true, message: G.Opt.MESSAGE_BATCH_UPDATE});
 * ```
 *
 * @memberOf module:_romantic
 * @method sexBatch
 * @param {ReactComponent} reference React组件引用。
 * @param {Function} callback 回调函数处理。
 * @param {Object} config 传入的配置数据。
 */
const sexBatch = (reference, callback, config = {}) => {
    /*
     * 1. 先检索 state 中是否包含了 $selected
     * 2. 再检索 props 中是否包含了 $selected
     */
    let $selected = reference.state ? reference.state.$selected : null;
    if (!$selected) {
        return _sexBatchProp(reference, callback, config);
    } else {
        return _sexBatchState(reference, callback, config);
    }
};

/**
 * ##「引擎」`Ux.sexCab`
 *
 * 配置增强读取的多义性函数。
 *
 * 1. 如果 key 传入为 undefined，则直接从 `props`中读取 `config` 变量，默认：`{}`。
 * 2. 如果 key 是字符串不带 `.` 操作符，则直接读取资源文件中的 `_<key`，内部调用 `fromHoc`（高频方式）。
 * 3. 如果 key 是字符串带 `.` 操作符，则直接将该值如：`key.xt` 转换成 `["key","xt"]`，对应 `_key -> xt` 节点。
 * 4. 如果 key 是Array，则执行 `fromPath` 方法。
 *
 * 该方法保证最终得到的值是合法的。
 *
 * @memberOf module:_romantic
 * @param {ReactComponent} reference React组件引用
 * @param {String} key 将要读取的配置的 key 值信息
 * @return {any} 返回读取到的最终信息
 */
const sexCab = (reference = {}, key) => {
    if (undefined === key) {
        /*
         * 直接返回 props 中的 config
         */
        const {config = {}} = reference.props;
        return config;
    } else if ("string" === typeof key) {
        if (0 < key.indexOf(".")) {
            /*
             * key 中包含 . 操作符
             */
            const keys = key.split('.');
            return sexCab(reference, keys);
        } else {
            /*
             * 直接读取静态文件，state中的 $hoc
             */
            const config = Eng.fromHoc(reference, key);
            return config ? config : {};
        }
    } else if (Abs.isArray(key)) {
        /*
         * key是数组
         */
        const config = Eng.fromPath(reference, key);
        return config ? config : {};
    } else {
        /*
         * key是对象
         */
        return Abs.isObject(key) ? key : {};
    }
};


/**
 * ## 「引擎」`Ux.sexOp`
 *
 * 1. events 会根据 op 节点的 key 值执行绑定，绑定时会调用一次
 *
 *      `events[op.key](reference)，所以必须是一个二阶函数`
 * 2. op 的数据结构参考下表
 *
 * ```json
 *
 * "_op": [
 *     {
            "key": "$opSave",
            "text": "保存",
            "icon": "save",
            "type": "primary"
 *     }
 * ]
 * ```
 *
 * @memberOf module:_romantic
 * @method sexOp
 * @param {ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Object} events 绑定的事件信息
 * @return {Array} 生成最终的 操作集合
 */
const sexOp = (reference, events = {}, key = "op") => {
    const $op = Eng.fromHoc(reference, key);
    if (Abs.isArray($op)) {
        $op.forEach(op => {
            let executor = events[op.key];
            if (Abs.isFunction(executor)) {
                executor = executor(reference);
                if (Abs.isFunction(executor)) {
                    op.onClick = executor;
                }
            }
        })
    }
    return $op;
}


/**
 * ## 「引擎」`Ux.sexModal`
 *
 * 内部使用组件`DialogButton`用于渲染带窗口操作按钮，`fnRender`渲染部分位于窗口内部。
 * 从 `key` 中提取资源文件配置，如果配置中包含了 `dialog` 和 `button` 则满足渲染条件，
 * 这种情况下，执行窗口配置，包括配置 onOk, onCancel 等函数和关闭函数，最终生成合法的配置
 * 传入到`DialogButton`组件中，形成带窗口的事件按钮。
 *
 * 最终计算的配置结构如：
 *
 * ```json
 * {
 *     "$mode": "窗口类型",
 *     "$dialog": "<窗口配置>",
 *     "$button": "<按钮操作>",
 *     "$loading": "<加载状态>"
 * }
 * ```
 *
 * @memberOf module:_romantic
 * @method sexModal
 * @param {ReactComponent} reference React组件引用。
 * @param {String} key 读取配置专用的 Key，内部调用 `sexCab` 方法确认配置可读取。
 * @param fnRender 渲染函数。
 * @return {Jsx} 返回最终渲染的Jsx。
 */
const sexModal = (reference, key, fnRender) => {
    if (Abs.isFunction(fnRender)) {
        const config = sexCab(reference, key);
        if (config.dialog && config.button) {
            const configuration = {};
            configuration.$mode = "DIALOG";
            /*
             * Dialog
             */
            configuration.$dialog = Eng.configDialog(reference, config.dialog);
            /*
             * Button
             */
            const button = Eng.aiExprAction(config.button);
            button.id = button.key;
            configuration.$button = button;
            /*
             * $loading
             */
            const {$submitting = false} = reference.state;
            configuration.$loading = $submitting;
            return (
                <DialogButton {...configuration}>
                    {fnRender()}
                </DialogButton>
            );
        } else return false;
    } else return false;
}
/**
 * ## 「引擎」`Ux.sexIdentifier`
 *
 * 前端标识规则选择器
 *
 * 根据配置执行标识规则选择，配置数据格式如：
 *
 * ```json
 * {
 *     "dataKey": "<抓取含有标识规则的字典>",
 *     "parentField": "<标识规则的父字段字段名>"
 * }
 * ```
 *
 * 选择规则：
 *
 * 1. 第一选择：直接选择`props`中的 `$identifier` 属性值作为第一选择标识规则。
 * 2. 第二选择：从 `dataKey` 中读取 Assist 数据，然后执行 treeShared 来执行选择。
 *
 * > 当前选择是选择 $options 相关的树中查找到的节点的 identifier 数据。
 *
 * @memberOf module:_romantic
 * @method sexIdentifier
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} config 标识规则选择配置。
 * @return {any} 返回的 identifier。
 */
const sexIdentifier = (reference, config = {}) => {
    const {
        dataKey = "data.category",
        parentField = "parentId"
    } = config;
    let identifier = null;
    const {$options = {}, $identifier} = reference.props;
    if ($identifier) {
        identifier = $identifier;
    } else {
        const {tree = []} = $options;
        if (0 < tree.length) {
            const treeArray = Eng.onDatum(reference, dataKey);
            identifier = T.treeShared(tree, treeArray, {
                parent: parentField,
                target: "identifier"
            });
        }
    }
    return identifier;
};

/**
 * ## 「引擎」`Ux.sexTable`
 *
 * 内部调用 `sexCab` 读取表格配置，一般 `key` 取 `table`，该配置可直接被
 * Ant Design中的`<Table/>`组件直接消费。
 *
 * @memberOf module:_romantic
 * @method sexTable
 * @param {ReactComponent} reference React组件。
 * @param {String} key 配置键值。
 * @return {any} 返回表格专用数据。
 */
const sexTable = (reference, key) => {
    const config = sexCab(reference, key);
    /*
     * 表格专用处理
     */
    const $config = Abs.clone(config);
    $config.columns = Eng.configColumn(reference, config.columns);
    $config.className = "web-table";
    $config.pagination = {size: "small"};
    return $config;
}


/**
 * ## 「引擎」`Ux.sexDialog`
 *
 * 弹出窗口专用函数，高频使用，直接捕捉窗口对象，内部使用代码如：
 *
 * ```js
 *      return Ux.ajaxPost(`/api/relation/definition`, request)
 *
 *          // 响应处理
 *          .then(() => Ux.sexDialog(reference, "submitted",
 *
 *              // 设置最终的提交为 false
 *              () => reference.setState({$submitting: false})))
 * ```
 *
 * 窗口专用配置结构如下，该函数第二参数传入的是下边结构中的`key1, key2, key3`，而窗口种类直接放到
 * 对应的子节点之下即可，系统会自动检测：
 *
 * ```json
 * {
 *     "_modal":{
 *         "success":{
 *             "key1": "message1"
 *         },
 *         "error":{
 *             "key2": "message2"
 *         },
 *         "confirm":{
 *             "key3": "message3"
 *         }
 *     }
 * }
 * ```
 *
 * @memberOf module:_romantic
 * @method sexDialog
 * @param {ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Function} callback 当前窗口专用回调函数，用户窗口点击按钮的回调。
 */
const sexDialog = (reference, key = "", callback) => {
    const seek = cabModal(reference, key);
    if (Abs.isObject(seek)) {
        const {type, ...config} = seek;
        /*
         * 二义性执行
         * 1. callback = Function，回调执行
         * 2. callback = Object，非回调执行，第二种回调
         * -- ok: onOk 回调函数
         * -- 直接执行参数处理
         */
        if (Abs.isFunction(callback)) {
            config.onOk = callback;
        } else if (Abs.isObject(callback)) {
            if (callback) {
                config.content = T.formatExpr(config.content, callback);
                if (Abs.isFunction(callback['ok'])) {
                    config.onOk = callback['ok'];
                }
            }
        }
        if ("error" === type) {
            Modal.error(config);
        } else if ("success" === type) {
            Modal.success(config);
        } else if ("confirm" === type) {
            config.onCancel = () => {
                /*
                 * $loading: 加载专用状态
                 * $submitting：提交专用状态
                 */
                reference.setState({
                    $loading: false,
                    $submitting: false,
                });
            };
            Modal.confirm(config);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}


/**
 * ## 「引擎」`Ux.sexMessage`
 *
 * 该函数和模态框的窗口配置没太大的，区别，核心结构如下，唯一的区别是响应过后不使用模态框，直接使用`message`消息框。
 *
 * ```json
 * {
 *     "_modal":{
 *         "success":{
 *             "key1": "message1"
 *         },
 *         "error":{
 *             "key2": "message2"
 *         },
 *         "confirm":{
 *             "key3": "message3"
 *         }
 *     }
 * }
 * ```
 *
 * @memberOf module:_romantic
 * @method sexMessage
 * @param {ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Number} duration 消息停留的时间。
 */
const sexMessage = (reference, key = "", duration = 1.2) => {
    const seek = cabModal(reference, key);
    if (Abs.isObject(seek)) {
        const {type, ...config} = seek;
        message.destroy();
        message.config({maxCount: 1});
        if ("error" === type) {
            message.error(config.content, duration);
        } else if ("success" === type) {
            message.success(config.content, duration);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}
export default {
    /*
     * 读取配置骚操作
     * 1. key = string，直接调 Ux.fromHoc(reference, key)
     * 2. key = Array 或 key包含了 . 数据，直接调 Ux.fromPath(reference, key)
     * 3. key = object, 直接返回 key
     * 4. key = undefined，不传，返回 props 的 config
     */
    sexCab,
    sexOp,

    /*
     * {
     *     "dialog": "",
     *     "button": ""
     * }
     */
    sexModal,
    sexIdentifier,

    sexTable,
    sexDialog,

    sexBatch,
    sexMessage,
}