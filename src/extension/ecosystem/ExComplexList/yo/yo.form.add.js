import Ex from "ex";
import Op from "../Op.Event";

export default (reference, item = {}) => {
    const formAttrs = Ex.yoAmbient(reference);
    /*
     * 关闭函数
     */
    formAttrs.rxClose = Op.rxClose(reference, item);
    /*
     * 设置 state -> $dirty 的函数
     */
    formAttrs.doDirty = Ex.rxDirty(reference);
    /*
     * 设置唯一的 $addKey
     * 这个值就是 Tab 中的 activeKey
     */
    formAttrs.$addKey = item.key;
    return formAttrs;
}