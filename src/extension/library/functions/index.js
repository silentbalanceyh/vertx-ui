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
 * # 核心工具函数
 *
 * @module _function
 */
/**
 *
 * # 常量定义模块
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