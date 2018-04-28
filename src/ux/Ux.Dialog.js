import {Modal} from 'antd';
import Prop from './Ux.Prop';
import Expr from './Ux.Expr';
import U from 'underscore'

const _captureKey = (reference, key) => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const dialog = $hoc._("dialog");
        return dialog[key];
    } else {
        return "";
    }
};

const _buildConfig = (reference, message, fnSuccess, key) => {
    const config = {
        title: _captureKey(reference, key),
        content: message
    };
    if (U.isFunction(fnSuccess)) {
        config.onOk = fnSuccess;
    }
    return config;
};
/**
 * 错误信息显示窗口
 * @method showError
 * @param {ReactComponent} reference React对应组件引用
 * @param message 直接呈现的消息
 * @param {Function} fnSuccess 窗口按钮的回调函数
 */
const showError = (reference, message, fnSuccess) => Modal.error(_buildConfig(reference, message, fnSuccess, "error"));
/**
 * 成功信息显示专用窗口
 * @method showSuccess
 * @param {ReactComponent} reference React对应组件引用
 * @param message 直接呈现的消息
 * @param {Function} fnSuccess 窗口按钮的回调函数
 */
const showSuccess = (reference, message, fnSuccess) => Modal.success(_buildConfig(reference, message, fnSuccess, "success"));

const _dialogFun = {
    success: showSuccess,
    error: showError
};
/**
 * 显示窗口专用函数，该函数用于根据资源文件中的配置信息显示窗口，资源文件必须包含`_modal`或`modal`节点；
 * * key用于从`modal`配置中提取窗口信息
 * @method showDialog
 * @param {ReactComponent} reference React对应组件引用
 * @param {String} key 提取配置的key值
 * @param {Function} fnSuccess 窗口按钮的回调函数
 * @param {Object} params 传入参数，用于处理message专用
 * @example
 *
 *      ...
 *      "_modal": {
 *          "type": "success",
 *          "message": {
 *              "add": "您的账单项目添加成功！",
 *              "edit": "您的账单项目保存成功！"
 *          }
 *      }
 */
const showDialog = (reference, key, fnSuccess, params) => {
    const modal = Prop.fromHoc(reference, "modal");
    const fun = _dialogFun[modal.type];
    let message = modal.message[key];
    if (params) {
        message = Expr.formatExpr(message, params);
    }
    fun(reference, message, fnSuccess);
};
/**
 * 显示窗口专用函数，直接和React的组件联合使用
 * * `fnShow`函数必须存在于reference.props
 * @method fadeIn
 * @param {ReactComponent} reference React对应组件引用
 */
const fadeIn = (reference = {}) => {
    const {fnShow} = reference.props;
    if (fnShow) fnShow();
};
/**
 * 隐藏窗口专用函数，直接和React的组件联合使用
 * * `fnHide`函数必须存在于reference.props
 * @method fadeOut
 * @param {ReactComponent} reference React对应组件引用
 */
const fadeOut = (reference = {}) => {
    const {fnHide} = reference.props;
    if (fnHide) fnHide();
};
/**
 * @class Dialog
 * @description 窗口专用雷用于处理弹出窗口的开与关的信息
 */
export default {
    fadeIn,
    fadeOut,
    showError,
    showSuccess,
    showDialog
}
