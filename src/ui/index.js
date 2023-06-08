import uiPage from './ui.page';

/**
 * # 快速开发专用模块
 *
 * 目前快速开发有两个核心方法，其操作不同于`Ux`和`Ex`，如果使用Ux和Ex，调用代码如下：
 *
 * ```js
 * // 标准工具
 * import Ux from 'ux';
 * // 扩展工具（带业务）
 * import Ex from 'ex';
 *
 * // 快速开发
 * import Ui from 'ui';
 * ```
 *
 * 核心入口文档专用文件，用于定义新模块
 *
 * @module smart/ui
 */
export default {
    ...uiPage,
}