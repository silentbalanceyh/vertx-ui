import global from './global';
import business from './business';
// ------------- 上边是全局处理 -------------
import E from './debug/error';
// ------------- 上边是调试专用 -------------
import is from './is';

import func from './func';
import parser from './parser';
import generator from './generator';
import control from './control';

export default {
    /*
     * mapMeta
     * mapUri
     * toUri
     * toDialog
     */
    ...func,
    /*
     * xtParam
     * xtOp
     */
    ...control,
    /*
     * 变化检查
     */
    ...is,
    /*
     *
     */
    ...generator,
    // ...funcGenerate,
    // ...funcBind,
    /*
     * 全局处理
     */
    ...global,
    /*
     * 所有合法选项
     */
    E,
    /*
     * 业务方法
     */
    ...business,

    ...parser
}