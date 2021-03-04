import global from './global';
import authority from './authority';
// ------------- 上边是全局处理 -------------
import E from './error';
// ------------- 上边是调试专用 -------------
import business from './business';
import func from './func';
import parser from './parser';
import generator from './generator';
import config from './config';
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
export default {
    ...func,
    ...config,
    ...generator,
    ...global,
    ...business,
    ...authority,
    E,
    X6,

    ...parser,
}