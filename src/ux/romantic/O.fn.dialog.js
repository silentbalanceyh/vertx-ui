import Abs from '../abyss';
import {Modal} from 'antd';
import Cmn from './I.common';

/**
 * ## 特殊函数「Zero」
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
export default (reference, key = "", callback) => {
    const seek = Cmn.cabModal(reference, key);
    if (Abs.isObject(seek)) {
        const {type, ...config} = seek;
        if (Abs.isFunction(callback)) {
            config.onOk = callback;
        }
        if ("error" === type) {
            Modal.error(config);
        } else if ("success" === type) {
            Modal.success(config);
        } else if ("confirm" === type) {
            config.onCancel = () => {
                /*
                 * $loading: SUBMIT 专用状态
                 */
                reference.setState({$loading: false});
            };
            Modal.confirm(config);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}