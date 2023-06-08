import __Zn from './zero.module.dependency';
import __CB from './rapid.fn.sex.configuration';
import {DialogButton} from "zi";
import {message} from 'antd';

const cabModal = (reference, key) => {
    const modal = __Zn.fromHoc(reference, "modal");
    const seek = {};
    if (__Zn.isObject(modal)) {
        const title = __Zn.fromHoc(reference, "dialog");
        Object.keys(modal).forEach(type => {
            /*
             * 检查
             */
            const config = modal[type];
            if (__Zn.isObject(config)) {
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
const sexDialog = (reference, key = "", callback) => {
    const seek = cabModal(reference, key);
    if (__Zn.isObject(seek)) {
        const {type, ...config} = seek;
        /*
         * 二义性执行
         * 1. callback = Function，回调执行
         * 2. callback = Object，非回调执行，第二种回调
         * -- ok: onOk 回调函数
         * -- 直接执行参数处理
         */
        if (__Zn.isFunction(callback)) {
            config.onOk = callback;
        } else if (__Zn.isObject(callback)) {
            config.content = __Zn.formatExpr(config.content, callback);
            if (__Zn.isFunction(callback['ok'])) {
                config.onOk = callback['ok'];
            }
        }
        const md = __Zn.v4Modal();
        if ("error" === type) {
            md.error(config);
        } else if ("success" === type) {
            md.success(config);
        } else if ("confirm" === type) {
            config.onCancel = () => {
                /*
                 * $loading: 加载专用状态
                 * $submitting：提交专用状态
                 */
                __Zn.of(reference).load().handle(() => {

                    if (__Zn.isObject(callback)) {
                        const {cancel} = callback;
                        if (__Zn.isFunction(cancel)) {
                            cancel(config, reference);
                        }
                    }
                })
                // reference.?etState({
                //     $loading: false,
                //     $submitting: false,
                // });
                // if (__Zn.isObject(callback)) {
                //     const {cancel} = callback;
                //     if (__Zn.isFunction(cancel)) {
                //         cancel(config, reference);
                //     }
                // }

            };
            md.confirm(config);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}

const sexMessage = (reference, key = "", duration = 1.2) => {
    const seek = cabModal(reference, key);
    if (__Zn.isObject(seek)) {
        const {type, ...config} = seek;
        const ms = __Zn.v4Message();
        message.destroy();
        message.config({maxCount: 1});
        if ("error" === type) {
            ms.error(config.content, duration);
        } else if ("success" === type) {
            ms.success(config.content, duration);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}
const sexModal = (reference, key, fnRender) => {
    if (__Zn.isFunction(fnRender)) {
        const config = __CB.sexCab(reference, key);
        if (config.dialog && config.button) {
            const configuration = {};
            configuration.$mode = "DIALOG";
            /*
             * Dialog
             */
            configuration.$dialog = __Zn.configDialog(reference, config.dialog);
            /*
             * Button
             */
            const button = __Zn.aiExprAction(config.button);
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
export default {
    sexMessage,
    sexModal,
    sexDialog,
}