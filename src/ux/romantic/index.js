import sexCab from './O.fn.cab';
import sexModal from './O.fn.modal';

export default {
    /*
     * 读取配置骚操作
     * 1. key = string，直接调 Ux.fromHoc(reference, key)
     * 2. key = Array 或 key包含了 . 数据，直接调 Ux.fromPath(reference, key)
     * 3. key = object, 直接返回 key
     * 4. key = undefined，不传，返回 props 的 config
     */
    sexCab,// (reference, key)
    /*
     * {
     *     "dialog": "",
     *     "button": ""
     * }
     */
    sexModal
}