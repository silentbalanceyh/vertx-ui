import Eng from "../engine";
import {Modal} from "antd";
import Ut from '../unity';
import Abs from '../abyss';
import E from '../error';
import U from 'underscore';
import Msg from './O.ajax.message';

/**
 * ## 私有函数
 *
 * 响应的最终处理器，在接收到响应数据过后的界面操作，主要执行下边步骤：
 *
 * 1. 设置 reference 中的状态 `$loading` 为 false。
 * 2. 调用 `writeSubmit` 写入 redux 中的 Tree 数据相关信息，修改 Store。
 * 3. 抓取 `doSubmitting` 函数，执行它确认提交完成，关闭防重复提交。
 *
 * @memberOf module:__private
 * @param {React.Component} reference React组件引用
 * @param {boolean} redux 是否开启了 redux 数据流
 */
const ajaxEnd = (reference, redux) => () => {
    reference.setState({$loading: false});
    /*
     * 专用处理
     */
    if (redux) {
        Ut.writeSubmit(reference, false);
    }
    /*
     * 处理 doSubmitting 函数（Extension中专用）
     */
    const {doSubmitting} = reference.props;
    if (U.isFunction(doSubmitting)) {
        doSubmitting(false);
    }
};

/**
 * ## 标准函数「Zero」
 *
 * 错误信息专用函数，注，这里的 Component 的引用必须是绑定了`cab/cn/`中的资源文件的组件，
 * 资源文件中会自动包含 _dialog 的窗口键值，error的数据结构如：
 *
 * ```json
 * {
 *     "code": "错误代码，整数",
 *     "message": "错误信息",
 *     "info": "前端可读信息"
 * }
 * ```
 *
 * 处理最终的响应数据时候还需要考虑 redux 参数
 *
 * 1. redux = true，启用 redux 流程
 * 2. redux = false，不启用 redux 流程，仅使用当前组件流程，React 中的 state 状态流程
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用
 * @param {Object} error Zero 的核心错误响应信息
 * @param {boolean} redux 是否启用了 redux 流程写 redux 的树形数据
 */
const ajaxError = (reference, error = {}, redux = false) => {
    const {data = {}} = error;
    if (data.code < 0 && data.info) {
        /*
         * 这种情况下，错误信息来自于服务端
         */
        let dialog = Eng.fromHoc(reference, "dialog");
        if (!dialog) dialog = {};
        const config = {
            title: dialog.error, content: data.info,
            maskClosable: false,
        };
        config.onOk = ajaxEnd(reference, redux);
        Modal.error(config);
        // return Promise.reject(error);
    } else {
        /*
         * 是否包含了 client
         */
        if (data.client) {
            /*
             * 根据 redux 执行 onEnd
             */
            ajaxEnd(reference, redux)();
            // return Promise.reject(error);
        } else {
            console.error("[ Ux ] 核心错误！", error);
        }
    }
};
/* 私有方法 **/
const _setType = (config = {}, modal = {}, key) => {
    if (modal.confirm && modal.confirm.hasOwnProperty(key)) {
        config.mode = "confirm";
        config.pattern = modal.confirm[key];
    }
    if (modal.error && modal.error.hasOwnProperty(key)) {
        config.mode = "error";
        config.pattern = modal.error[key];
    }
    if (modal.success && modal.success.hasOwnProperty(key)) {
        config.mode = "success";
        config.pattern = modal.success[key];
    }
    if (!config.mode || !config.pattern) {
        console.error(`窗口配置 _modal 中无法找到 ${key}`);
    }
};
/* 私有方法 **/
const _showDialog = (reference, dialogConfig = {}, data) => {
    const {title, content, mode} = dialogConfig;
    const config = {title, content, maskClosable: false, destroyOnClose: true};
    const FUN = {
        "success": Modal.success,
        "error": Modal.error,
        "confirm": Modal.confirm,
    };
    const fnDialog = FUN[mode];
    config.onCancel = ajaxEnd(reference, dialogConfig.redux);
    return new Promise((resolve) => {
        config.onOk = () => {
            /*
             * 执行一次
             */
            ajaxEnd(reference, dialogConfig.redux)();
            resolve(data)
        };
        fnDialog(config);
    })
};
/**
 *
 * ## 标准函数「2阶」
 *
 * 直接封装 ajaxDialog 的2阶函数，函数参数如下：
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | data | any | 响应的核心数据信息，Object 或 Array |
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {function(*): Promise<T>} 返回函数，该函数会消费响应信息得到 Promise。
 */
const ajax2Dialog = (reference, key, redux = false) => (data) =>
    ajaxDialog(reference, {key, data, redux});
/**
 * ## 标准函数
 *
 * 弹出窗口专用函数，调用 Ant Design 中的 `Modal` 的弹出框处理，success, error, confirm 专用处理函数。
 * 在传入的 reference 引用中，props 属性中必须包含 `config` 对象（窗口配置信息），它的结构如下：
 *
 * ### 1. key 为 String
 *
 * 如果传入的 `key` 是字符串，config 的配置结果如，这份结果来自资源文件中的 `shared.json`
 *
 * ```json
 * {
 *     "dialog": {
 *         "modal": "模式信息",
 *         "title": {
 *              "success": "信息",
 *              "failure": "警告",
 *              "error": "错误",
 *              "confirm": "提示"
 *         }
 *     }
 * }
 * ```
 *
 * 执行了计算过后，会处理以下步骤
 *
 * 1. 根据 mode 计算窗口标题，从 `dialog`中的三种窗口中去读。
 * 2. 根据 pattern 数据计算最终的格式，Modal需要的。
 *
 * 计算的最终配置格式如：
 *
 * ```json
 * {
 *     "mode": "success | confirm | error",
 *     "title": "标题文本",
 *     "content": "内容使用 pattern 计算，执行 formatExpr 的格式化",
 *     "redux": "是否开启 redux 流程"
 * }
 * ```
 *
 * ### 2. key 为 Object
 *
 * 这是第二种配置模式，传入的 key 转换成 configuration 过后的数据格式如：
 *
 * ```json
 * {
 *     "title": "标题信息",
 *     "pattern": "未解析的模式",
 *     "content": "二选一，是否执行 formatExpr 的格式化操作",
 *     "model": "success | confirm | error",
 *     "redux": "是否开启 redux 流程"
 * }
 * ```
 *
 * ### 3. 最终格式
 *
 * 不论 key 的传入类型是哪种，最终的处理格式如"
 *
 * ```json
 * {
 *     "title": "",
 *     "content": "",
 *     "mode": ""
 *     "redux": ""
 * }
 * ```
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {Object | Array} data 响应数据处理格式。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {Promise<T>} 返回效应窗口之外最终的 Promise。
 */
const ajaxDialog = (reference, {
    data, key, redux = false
}) => {
    const {config = {}} = reference.props;
    const {dialog = {}} = config;
    /*
     * modal:{
     *      confirm: （ 第一优先级 ）
     *      error:   （ 第二优先级 ）
     *      success: （ 第三优先级 ）
     * }
     */
    const dialogConfig = {};
    if ("string" === typeof key) {
        const {modal, title = {}} = dialog;
        _setType(dialogConfig, modal, key);
        /*
         * 计算结果
         * mode：success, failure, confirm
         * pattern：抓取的格式数据
         */
        dialogConfig.title = title[dialogConfig.mode];
        /*
         * 使用数据执行 format
         */
        if (dialogConfig.pattern) {
            dialogConfig.content = Ut.formatExpr(dialogConfig.pattern, data);
        }
        dialogConfig.redux = redux;     // 连接 redux 处理响应
    } else {
        if (U.isObject(key)) {
            // 配置模式
            const configuration = Abs.clone(key);
            dialogConfig.title = configuration.title;
            if (configuration.pattern) {
                dialogConfig.content = Ut.formatExpr(configuration.pattern, data);
            } else {
                dialogConfig.content = configuration.content;
            }
            dialogConfig.mode = configuration.mode;
            dialogConfig.redux = redux;     // 连接 redux 处理响应
        }
    }
    return _showDialog(reference, dialogConfig, data);
};
/**
 * ## 标准函数「2阶」
 *
 *
 * 直接封装 ajaxMessage 的2阶函数，函数参数如下：
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | data | any | 响应的核心数据信息，Object 或 Array |
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {function(*): Promise<T>} 返回函数，该函数会消费响应信息得到 Promise。
 */
const ajax2Message = (reference, key, redux = false) => (data) =>
    ajaxMessage(reference, {key, data, redux});
/**
 * ## 标准函数
 *
 * 该函数只支持一种格式，config 的配置结果如，这份结果来自资源文件中的 `shared.json`
 * 但由于是 message 所以只考虑最终的 pattern 配置，并且使用 data 来执行 formatExpr 得到最终
 * 的 content 相关数据，消息只执行两种模式
 *
 * * success：成功相关信息
 * * <any>：其他模式，直接执行 failure 的错误消息提示
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {Object | Array} data 响应数据处理格式。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @return {Promise<T>} 返回效应窗口之外最终的 Promise。
 */
const ajaxMessage = (reference, {
    data, key,
}) => {
    const {config = {}} = reference.props;
    const {dialog = {}} = config;
    /*
     * modal:{
     *      confirm: （ 第一优先级 ）
     *      error:   （ 第二优先级 ）
     *      success: （ 第三优先级 ）
     * }
     */
    const {modal} = dialog;
    const dialogConfig = {};
    _setType(dialogConfig, modal, key);
    /*
     * 使用数据执行 format
     */
    if (dialogConfig.pattern) {
        const message = Ut.formatExpr(dialogConfig.pattern, data);
        if ("success" === dialogConfig.mode) {
            Msg.messageSuccess(message);
        } else {
            Msg.messageFailure(message);
        }
    }
    return Abs.promise(data);
};
/**
 * 标准函数「2阶」
 *
 * 当前 ajax 比较特殊，ajax 请求只会响应 true 或 false，根据最终结果执行相关操作
 *
 * @memberOf module:_ajax
 * @param {Function} consumer 执行的核心函数，在响应数据为 true 时执行该函数
 * @param {String} content 消息中呈现的消息内容
 * @return {Function} 返回一个函数消费 true | false 的相关结果
 */
const ajax2True = (consumer, content) => (result) => {
    if (result) {
        if (U.isFunction(consumer)) {
            consumer();
            if (content) {
                Msg.messageSuccess(content);
            }
            return Abs.promise(result);
        } else {
            return E.fxReject(10106);
        }
    } else {
        return E.fxReject(10107);
    }
};
export default {
    ajaxError,
    ajaxDialog,
    ajaxMessage,

    ajax2Dialog,    // 2阶
    ajax2Message,   // 2阶
    ajax2True,      // 2阶
    ...Msg,
}