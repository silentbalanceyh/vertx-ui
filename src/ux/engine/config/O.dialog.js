import R from '../expression';
import Ut from '../../unity';
import Ele from '../../element';
import U from 'underscore';
import Abs from '../../abyss';
import Ux from "ux";

/**
 * ## 引擎函数
 *
 * 「标准配置」Dialog 专用的配置信息。
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 窗口配置专用数据。
 * @return {Object} 返回处理好的窗口配置。
 */
const configDialog = (reference, config = {}) => {
    const $dialog = R.aiExprWindow(config);
    /*
     * 使用解析结果来拷贝
     */
    const $config = Ux.clone($dialog);
    /*
     * onOk按钮
     */
    if ("string" === typeof $config.onOk) {
        $dialog.onOk = () => Ut.connectId($config.onOk);
    }
    /*
     * onCancel按钮
     */
    $dialog.onCancel = () => reference.setState({$visible: false});
    $dialog.destroyOnClose = true;
    $dialog.maskClosable = false;
    $dialog.className = "web-dialog";   // 默认窗口风格
    /*
     * 防重复提交
     */
    const {$visible = false} = reference.state;
    const $submitting = Ele.ambiguityValue(reference, "$submitting");
    $dialog.visible = $visible;
    $dialog.confirmLoading = $submitting;
    $dialog.cancelButtonProps = {
        loading: $submitting
    };
    return $dialog;
};
/**
 *
 * ## 引擎函数
 *
 * 锚点专用函数信息
 *
 * Array类型
 *
 * ```js
 * [
 *    id1, id2
 * ]
 * ```
 *
 * Object
 *
 * ```js
 * {
 *    key1 = id1,
 *    key2 = id2
 * }
 * ```
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array|Object} op 锚点按钮配置生成器。
 * @param {Function} callback 按钮执行函数，可以从callback中执行该函数。
 * @return {Array} 配置的最终锚点。
 */
const configAnchor = (reference, op, callback) => {
    const $button = [];
    const rxClick = (key) => (event) => {
        Abs.prevent(event);
        let state = {$visible: true};
        if (U.isFunction(callback[key])) {
            /*
             * 特殊 callback 回调
             */
            const promise = callback[key]();
            promise.then((callbackState = {}) => {
                Object.assign(callbackState, state);
                reference.setState(callbackState);
            });
        } else {
            reference.setState(state);
        }
    };
    if (op) {
        if (U.isArray(op)) {
            /*
             * 数组模式
             */
            op.forEach(key => {
                const button = {};
                button.key = key;
                button.id = key;
                button.className = "ux-hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        } else if (U.isObject(op)) {
            /*
             * 对象格式
             */
            Abs.itObject(op, (key, id) => {
                const button = {};
                button.key = key;
                button.id = id;
                button.className = "ux-hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        }
    }
    return $button;
};
export default {
    configDialog,
    configAnchor
}