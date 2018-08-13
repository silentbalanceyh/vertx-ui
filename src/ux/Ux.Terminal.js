import React from 'react';
import Prop from './Ux.Prop';
import Verifier from './Ux.Terminal.Verify';

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
const verifyCard = (ref = {}) => {
    const {$key = "page", reference} = ref.props;
    let message = Verifier.verifyRooKey(reference, $key);
    // TODO: 后期处理
    return message;
};
const fxRender = (reference, render) => {
    const {error} = reference.state ? reference.state : {};
    if (error) {
        return fxError(error);
    } else {
        return render()
    }
};
export default {
    fxError,
    fxRender,
    verifyComplex,
    verifyCard,
    verifyKey: Verifier.verifyRooKey
}