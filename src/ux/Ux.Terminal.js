import React from 'react';
import E from './Ux.Error'
import Prop from './Ux.Prop';
import Verifier from './Ux.Terminal.Verify';

const _ensureKey = (reference, key = "") => {
    let message = undefined;
    if ("string" === typeof key) {
        const {$hoc} = reference.state;
        const name = $hoc.name();
        if (!key.startsWith("_")) key = `_${key}`;
        message = E.fxTerminal(true, 10001, name, key);
    }
    return message;
};

const fxRender = (reference = {}, key = "") => (fxError(_ensureKey(reference, key)));

const fxError = (message) => (<div className={"error-page"}>{message}</div>);
/**
 * 专用ComplexList的错误检测函数
 * @param reference
 * @param key
 */
const verifyComplex = (reference = {}, key = "") => {
    // 检查基础配置key下边有内容
    let message = Verifier.verifyRooKey(reference, key);
    if (!message) {
        const grid = Prop.fromHoc(reference, key);
        message = Verifier.verifyQuery(key, grid.query);
        // 其他验证
        if (!message) {
            message = Verifier.verifyOptions(key, grid.options);
        }
    }
    return message;
};
export default {
    fxRender,
    fxError,
    verifyComplex
}