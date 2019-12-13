import sexCab from './O.fn.cab';
import R from '../engine';
import U from 'underscore';
import {DialogButton} from 'web';
import React from 'react';
/*
 * 配置处理
 * config:
 * {
 *     "dialog": "xxxx",
 *     "button": "xxxx"
 * }
 * Component
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