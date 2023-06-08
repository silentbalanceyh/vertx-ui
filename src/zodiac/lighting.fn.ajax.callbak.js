import __RDX from './source.fn.write.redux';
import __MSG from './antd4.fn.message.reply';
import __Zn from './zero.module.dependency';

const __ajaxEnd = (reference, redux, error) => () => {
    // 1. Redux回调
    if (redux) {
        __RDX.writeSubmit(reference, false);
    }
    // 2. error出现时callback回调，只限于error
    if (error) {
        if (__Zn.isFunction(error.callback)) {
            /*
             * 非异常提交需要外层提供
             * callback 函数
             */
            error.callback();
        } else {
            /*
             * 异常提交模式
             * $submitting = false
             * $loading = false
             */
            __Zn.of(reference).in({
                $loading: false,
                $submitting: false,
                $spinning: false
            }).done();
        }
    }
    // 3. 防重复提交
    __Zn.ambFormEnd(reference);
};
const ajaxError = (reference, error = {}, redux = false) => {
    const {data = {}} = error;
    if (data.code < 0 && data.info) {
        /*
         * Server -- 这种情况下，错误信息来源于服务端
         */
        let dialog = __Zn.fromHoc(reference, "dialog");
        if (!dialog) dialog = {};
        const config = {
            title: dialog.error, content: data.info,
            maskClosable: false,
        };
        config.onOk = __ajaxEnd(reference, redux, error);
        const md = __Zn.v4Modal();
        md.error(config);
        // return Promise.reject(error);
    } else {
        /*
         * 信息来源于客户端，是否包含了 client
         * 1. 包含 client 属性（Ox专用）
         * 2. 直接返回 data 数据，data是一个字符串
         */
        if (data.client) {
            /*
             * 根据 redux 执行 onEnd
             */
            __ajaxEnd(reference, redux)();
            // return Promise.reject(error);
        } else {
            const {data} = error;
            if ("string" === typeof data) {
                const ms = __Zn.v4Message();
                ms.error(data, 1.5);
                __ajaxEnd(reference, redux)();
            } else {
                console.error("[ Ux ] 核心错误！", error);
            }
        }
    }
};

/* 私有方法 **/
const __dialogType = (config = {}, modal = {}, key) => {
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
const __dialogShow = (reference, dialogConfig = {}, data) => {
    const {title, content, mode} = dialogConfig;
    const config = {title, content, maskClosable: false, destroyOnClose: true};
    const md = __Zn.v4Modal();
    const DIALOG_FN = {
        success: md.success,
        error: md.error,
        confirm: md.confirm,
    }
    const fnDialog = DIALOG_FN[mode];
    config.onCancel = __ajaxEnd(reference, dialogConfig.redux);
    return new Promise((resolve) => {
        config.onOk = () => {
            /*
             * 执行一次
             */
            __ajaxEnd(reference, dialogConfig.redux)();
            resolve(data)
        };
        config.onCancel = () => {
            /*
             * 执行一次
             */
            __ajaxEnd(reference, dialogConfig.redux)();
            // rxCancel

            __Zn.fn(reference).rxCancel(data, reference);
            resolve(data)
        }
        fnDialog(config);
    })
};

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
        __dialogType(dialogConfig, modal, key);
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
            dialogConfig.content = __Zn.formatExpr(dialogConfig.pattern, data);
        }
        dialogConfig.redux = redux;     // 连接 redux 处理响应
    } else {
        if (__Zn.isObject(key)) {
            // 配置模式
            const configuration = __Zn.clone(key);
            dialogConfig.title = configuration.title;
            if (configuration.pattern) {
                dialogConfig.content = __Zn.formatExpr(configuration.pattern, data);
            } else {
                dialogConfig.content = configuration.content;
            }
            dialogConfig.mode = configuration.mode;
            dialogConfig.redux = redux;     // 连接 redux 处理响应
        }
    }
    return __dialogShow(reference, dialogConfig, data);
};

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
    __dialogType(dialogConfig, modal, key);
    /*
     * 使用数据执行 format
     */
    if (dialogConfig.pattern) {
        const message = __Zn.formatExpr(dialogConfig.pattern, data);
        if ("success" === dialogConfig.mode) {
            __MSG.messageSuccess(message);
        } else {
            __MSG.messageFailure(message);
        }
    }
    return __Zn.promise(data);
};
const ajax2True = (consumer, content) => (result) => {
    if (result) {
        if (__Zn.isFunction(consumer)) {
            consumer();
            if (content) {
                __MSG.messageSuccess(content);
            }
            return __Zn.promise(result);
        } else {
            return __Zn.fxReject(10106);
        }
    } else {
        return __Zn.fxReject(10107);
    }
};
export default {
    ajaxError,
    ajaxDialog,
    ajaxMessage,

    ajax2Dialog: (reference, key, redux = false) => (data) =>
        ajaxDialog(reference, {key, data, redux}),
    ajax2Message: (reference, key, redux = false) => (data) =>
        ajaxMessage(reference, {key, data, redux}),
    ajax2True,
}