import global from './global';
import business from './business';
import authority from './authority';
// ------------- 上边是全局处理 -------------
import E from './error';
// ------------- 上边是调试专用 -------------
import func from './func';
import parser from './parser';
import generator from './generator';
import control from './control';
// ------------- X6 -----------------------
import graphic from './graphic';

/**
 * 内部模块
 *
 * 解析器模块
 *
 * @module _parser
 */
/**
 * 内部模块
 *
 * 挂载模块
 *
 * @module _on
 */
/**
 * 内部模块
 *
 * 数据输入输出
 *
 * @module _io
 */
/**
 * 内部模块
 *
 * 业务专用
 *
 * @module _business
 */
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
/**
 * 内部模块
 *
 * 更新判断
 *
 * @module _up
 */
/**
 * 内部模块
 *
 * 转换模块
 *
 * @module _to
 */
/**
 * 内部模块
 *
 * 转换模块
 *
 * @module _authority
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
    ...graphic,
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

    ...parser,
    ...authority
}