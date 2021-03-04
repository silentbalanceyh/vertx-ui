import Yo from "./yo";
import {LoadingAlert, PageCard} from "web";
import React from "react";
import Ux from "ux";

/**
 * ## 渲染函数
 *
 * 渲染带 `PageCard` 的页面专用组件。
 *
 * config 配置的数据结构
 *
 * ```js
 * {
 *      title: 坐上标题（同一个页面切换刷参数时必须）
 *      header：提示信息，用于加载 LoadingAlert 的表单说明信息（头）
 *      name: 当前组件的名称
 *      color：当前日志的背景色（白色字体）
 * }
 * ```
 *
 * @memberOf module:_channel
 * @method ylCard
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {Jsx}
 */
const ylCard = (reference, fnRender, config = {}) => {
    const {
        title, extra, header,
        leftVisible = true,
        ...LOG
    } = config;
    return Yo.yoRender(reference, () => {
        const attrs = {};
        if (title) {
            /*
             * 特殊配置，左边页面上的标题
             */
            attrs.$title = title;
        }
        if (extra) {
            /*
             * 页数配置，extraContent 部分的内容
             */
            attrs.$extra = extra;
        }
        attrs.$leftVisible = leftVisible;
        /*
         * 切换类按钮处理
         * 1）切换显示按钮专用
         * 2）处理 $activeKey 的状态
         */
        const {$disabled = false} = reference.state;
        attrs.$disabled = $disabled;
        return (
            <PageCard reference={reference} {...attrs}>
                {
                    /* 警告提示信息
                     * 如果包含了 prompt 配置则直接渲染
                     */
                }
                {header ? (
                    <LoadingAlert {...header}/>
                ) : false}
                {Ux.isFunction(fnRender) ? fnRender() : false}
            </PageCard>
        )
    }, LOG)
}

/**
 *
 * ## 渲染函数
 *
 *
 * 用于渲染通用模块：
 *
 * 1. `/ambient/tabular/:type`    字典
 * 2. `/ambient/category/:type`   类别（树形字典）
 * 3. `/ambient/employee/:type`   员工
 * 4. `/ambient/identity/:type`   档案（个人隐私）
 * 5. `/ambient/customer/:type`   客户信息
 *
 * 专用统一模块渲染流程
 *
 * @memberOf module:_channel
 * @method ylDynamic
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {Jsx}
 */
const ylDynamic = (reference, fnRender, config = {}) => {
    /*
     * 处理 $title 变化专用
     */
    let page = Ux.fromHoc(reference, "page");
    if (!page) page = {};
    /*
     * 输入专用 $config
     */
    const $config = {};
    Object.assign($config, config);
    $config.title = page.title;     // 处理标题
    return ylCard(reference, fnRender, $config);
}
export default {
    ylCard,         // 带 PageCard 页面专用
    ylDynamic,      // 动态页面专用
}