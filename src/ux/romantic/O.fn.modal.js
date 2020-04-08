import sexCab from './O.fn.cab';
import R from '../engine';
import U from 'underscore';
import {DialogButton} from 'web';
import React from 'react';

/**
 * ## 特殊函数「Zero, Jsx」
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
export default (reference, key, fnRender) => {
    if (U.isFunction(fnRender)) {
        const config = sexCab(reference, key);
        if (config.dialog && config.button) {
            const configuration = {};
            configuration.$mode = "DIALOG";
            /*
             * Dialog
             */
            configuration.$dialog = R.configDialog(reference, config.dialog);
            /*
             * Button
             */
            const button = R.aiExprAction(config.button);
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