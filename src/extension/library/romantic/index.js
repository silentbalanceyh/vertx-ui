/*
 * Extension 框架的：骚操作
 * Ex系列组件专用，不同输入产生统一输出
 */
import sexExAction from './O.fn.ex.action';
import sexExPlugin from './O.fn.ex.plugin';

export default {
    sexExAction,
    /*
     * 插件系统，只能放到 Extension 中，不可出现在标准包
     */
    sexExPlugin
}