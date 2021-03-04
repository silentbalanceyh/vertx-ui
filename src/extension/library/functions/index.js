import global from './global';
import authority from './authority';
// ------------- 上边是全局处理 -------------
import E from './error';
// ------------- 上边是调试专用 -------------
import business from './business';
import func from './func';
import parser from './parser';
import generator from './generator';
import control from './control';
// ------------- X6 -----------------------
import X6 from './x6';

/**
 * 内部模块
 *
 * 原子操作
 *
 * @module _function
 */
/**
 * 内部模块
 *
 * 常量模块
 *
 * @module _constant
 */
/**
 * 内部模块
 *
 * 配置模块
 *
 * @module _config
 */
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
    X6,
    /*
     * 业务方法
     */
    ...business,

    ...parser,
    ...authority
}