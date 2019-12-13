import input from './O.input';
import qrComplex from './O.fn.complex';
import qrCombine from './O.fn.combine';
import qrCommon from './O.fn.common';
/*
 * 查询专用方法
 * ir 打头
 */
export default {
    ...input,
    /*
     * 特殊方法用于合并 table 内部的 query 相关信息
     */
    qrComplex,
    /*
     * 直接合并 criteria 到 query 中
     */
    qrCombine,
    /*
     * 处理 common 相关的查询条件
     */
    qrCommon,
}