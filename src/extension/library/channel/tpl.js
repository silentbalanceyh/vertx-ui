import Yo from "./yo";
import {LoadingAlert, PageCard} from "web";
import React from "react";
import Ux from "ux";

/**
 * ## 「通道」`Ex.ylCard`
 *
 * ### 1. 基本介绍
 *
 * 渲染带 `PageCard` 的页面专用组件。
 *
 * config 配置的数据结构
 *
 * ```js
 * {
 *      title: 左上标题（同一个页面切换刷参数时必须）
 *      header：提示信息，用于加载 LoadingAlert 的表单说明信息（头）
 *      name: 当前组件的名称
 *      color：当前日志的背景色（白色字体）
 * }
 * ```
 *
 * ### 2. 构造属性
 *
 * 该方法会根据`config`构造`PageCard`组件所需的所有属性，并且在执行渲染之前检查`$ready`的值，
 * 如果`$ready`值为true才执行界面渲染。
 *
 * |属性|含义|
 * |:---|:---|
 * |$title|左上角的标题信息。|
 * |$extra|构造extraContent右上角核心组件信息。|
 * |$leftVisible|是否显示左边按钮。|
 * |$disabled|是否禁用按钮。|
 * |reference|需传入的当前React组件引用。|
 *
 * @memberOf module:_channel
 * @method ylCard
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 子组件渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {JSX.Element}
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
                {header ? (<LoadingAlert {...header}/>) : false}
                {Ux.isFunction(fnRender) ? fnRender() : false}
            </PageCard>
        )
    }, LOG)
}

/**
 * ## 「通道」`Ex.ylDynamic`
 *
 * ### 1. 基本介绍
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
 * ### 2. 扩展模块
 *
 * 这个函数为扩展模块专用函数，主要用于简化扩展模块中的页面开发，这种页面大部分布局如下伪图：
 *
 * ```
 * |------------------------------------------|
 * | Title (Left)               (Right) Extra |
 * |------------------------------------------|
 * || Content                                ||
 * ||                                        ||
 * ||                                        ||
 * ||                                        ||
 * ||----------------------------------------||
 * ```
 *
 * PageCard主要用于定义上述不同区域的配置，且`ylDynamic`会将`cab`中的资源文件配置作为默认
 * 配置，如果从远程`X_MODULE`读取到了特殊配置则会覆盖默认配置。
 *
 * @memberOf module:_channel
 * @method ylDynamic
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {JSX.Element}
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