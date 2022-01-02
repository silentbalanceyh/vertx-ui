import Yo from "./yo";
import {LoadingAlert, PageCard} from "web";
import React from "react";
import Ux from "ux";
import Fn from "../functions";

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

const isSatisfy = (reference, view = Fn.Mode.LIST) => {
    const {options = {}} = reference.state;
    if (Fn.Mode.LIST !== view) {
        /*
         * 如果是添加
         */
        if (Fn.Mode.ADD === view) {
            /*
             *  ADD 添加视图
             *  tabs.extra.add 键值
             *  1）如果没有该值，则显示
             *  2）如果有该值，那么该值必须存在
             */
            if (options.hasOwnProperty(Fn.Opt.TABS_EXTRA_ADD)) {
                return !!options[Fn.Opt.TABS_EXTRA_ADD];
            } else return true;  // 不设置直接 true
        } else if (Fn.Mode.EDIT === view) {
            /*
             *  EDIT 编辑视图
             *  tabs.extra.edit 键值
             *  1）如果没有该值，则显示
             *  2）如果有该值，那么该值必须存在
             */
            if (options.hasOwnProperty(Fn.Opt.TABS_EXTRA_EDIT)) {
                return !!options[Fn.Opt.TABS_EXTRA_EDIT];
            } else return true;  // 不设置直接 true
        } else return false; // 否则 false
    } else return false; // 否则 false
};
const isOk = (item = {}) => {
    return [
        "op.submit.save",
        "op.submit.delete",
        "op.submit.reset",
        "op.submit.close"
    ].includes(item.category)
};
const setEdition = (attrs = {}, reference) => {
    const {$inited = {}} = reference.state;
    const {metadata} = $inited;
    if (!Ux.isEmpty(metadata)) {
        const {plugins} = reference.state;
        const executor = plugins && Ux.isFunction(plugins.pluginRow) ?
            plugins.pluginRow : () => null;
        const result = executor($inited, reference);
        attrs.config.filter(isOk).forEach(item => {
            /*
             * 是否可编辑
             */
            if ("op.submit.delete" === item.category) {
                item.visible = !!result.deletion;
            }
            if ("op.submit.save" === item.category) {
                item.visible = !!result.edition;
            }
            if ("op.submit.reset" === item.category) {
                item.visible = !!result.edition || !!result.deletion;
            }
        })
    }
};

const EXECUTOR_EXTRA = {};
EXECUTOR_EXTRA[Fn.Mode.EDIT] = "rxExtraEdit";
EXECUTOR_EXTRA[Fn.Mode.ADD] = "rxExtraAdd";
EXECUTOR_EXTRA[Fn.Mode.LIST] = "rxExtraList";
EXECUTOR_EXTRA[Fn.Mode.FILTER] = "rxExtraFilter";
/**
 * ## 「通道」`Ex.ylTabExtra`
 *
 * > 优先读取`Ex.yoAction`构造继承属性集，当前版本提供给`ExListXxx`组件内部专用。
 *
 * ### 1. 基本介绍
 *
 * 统一处理表单内部的按钮区域，它包含两种状态。
 *
 * |视图模式|按钮|含义|
 * |---|---|:---|
 * |add|`添加，重置`|添加表单界面专用按钮。|
 * |edit|`编辑，删除，重置`|编辑表单界面专用按钮。|
 *
 * 如果配置了`op.extension`那么扩展按钮会根据其`index`的配置插入到对应位置，并且这些按钮的显示还被下边两个因素影响：
 *
 * 1. 操作用户是否具有这些操作按钮的ACL权限。
 * 2. 这个列表中是否已经配置了这些按钮。
 *
 * ### 2. 构造属性表
 *
 * |源属性名|源|类型|目标属性名|含义|
 * |:---|---|---|:---|:---|
 * |构造||state|config|计算当前Extra区域按钮的基本配置。|
 * |$submitting|state|Boolean|$submitting|是否处于提交状态（防重复提交专用属性）。|
 * |activeKey|第二参数|String|$activeKey|被激活的页签主键。|
 * |$view|state|String|$view|视图模式读取，三种：`list, add, edit`。|
 * |构造||Function|doSubmitting|防重复提交专用函数。|
 *
 * ### 3. 核心
 *
 * #### 3.1. 满足构造条件
 *
 * 1. 视图模式必须是`add`或`edit`。
 * 2. 如果是`add`，必须配置了`tabs.extra.add`项。
 * 3. 如果是`edit`，必须配置了`tabs.extra.edit`项。
 *
 * > 如果构造条件不满足，那么extra部分不显示任何东西。
 *
 * #### 3.2. RESET
 *
 * 重置按钮是一个特殊的存在，必须是可操作按钮存在的情况才执行重置，如果不存在可操作按钮，那么重置会无效。
 *
 * 检测代码：
 *
 * ```js
 * // 检查是否计算结果是单独的重置按钮RESET
 * if (attrs.config && 1 === attrs.config.length) {
 *      attrs.config = attrs.config.filter(item => "op.submit.reset" !== item.category);
 * }
 * ```
 *
 * #### 3.3. 权限控制
 *
 * 调用`setEdition`内部私有方法计算可编辑的相关关系，实现对某个表单的ACL权限控制，直到可控制表单三态。
 *
 * @memberOf module:_channel
 * @param {ReactComponent} reference React组件引用
 * @param {Object} tabs `<Tabs/>`的基本配置
 * @param {Function} UI
 * @returns {Object}
 */
const ylTabExtra = (reference, tabs = {}, UI) => {
    /*
     * 提交状态
     * state -> $submitting
     * state -> view
     */
    const {
        $submitting = false,
        $view = Fn.Mode.LIST,
        $inited = {}
    } = reference.state;
    const {$executor = {}} = reference.props;
    const fnKey = EXECUTOR_EXTRA[$view];
    const fnJsx = $executor[fnKey];
    const fnJsxDefault = () => {
        if (isSatisfy(reference, $view)) {
            /*
             * 1.添加流程
             * 2.编辑流程
             * 双流程单独处理
             */
            const prefix = Fn.Mode.ADD === $view ? "op.add" : "op.edit";
            /*
             * 特殊配置
             * 1）tab.extra.add
             * 2）tab.extra.edit
             */
            const attrs = Yo.yoAction(reference, prefix, Fn.Order);
            /*
             * 扩展执行
             */
            attrs.config = Yo.yoExtension(reference, `op.submit.${$view}`, attrs.config);
            /*
             * 编辑界面核心操作
             */
            if (Fn.Mode.EDIT === $view) {
                /*
                 * 设置可编辑的基础关系
                 */
                setEdition(attrs, reference);
                attrs.config = Ux.pluginSeeEdit(reference, $inited, attrs.config);
                /* 处理 config */
                if (attrs.config && 1 === attrs.config.length) {
                    /*
                     * 单 reset 不呈现
                     * 此种情况只有一个 RESET 按钮，直接过滤掉
                     ***/
                    attrs.config = attrs.config.filter(item => "op.submit.reset" !== item.category);
                }

            } else {
                attrs.config = Ux.pluginSeeAdd(reference, $inited, attrs.config);
            }
            /*
             * 显示删除按钮
             */
            if (0 === attrs.config.length) {
                const {options = {}} = reference.state;
                /*
                 * op.submit.close 只有在没有任何按钮存在时才会出现
                 * 且除了文字可以更改，其他内容目前版本全程固定
                 */
                if (options['op.submit.close']) {
                    const button = {
                        icon: 'close-circle',
                        className: "ux-spec",
                        key: "opFormClose",
                        text: options['op.submit.close']
                    }
                    button.onClick = (event) => {
                        Ux.prevent(event);
                        Fn.rxTabClose(reference)($inited.key, {
                            $dirty: true,
                            $submitting: false
                        })
                    }
                    attrs.config.push(button);
                }
            }
            attrs.$submitting = $submitting;
            attrs.$activeKey = tabs.activeKey;
            attrs.$view = $view;
            /* 核心参数传入 ExAction */
            attrs.doSubmitting = Fn.rxSubmitting(reference);
            // attrs.fnSubmitting = Fn.generate(reference).submitting;
            const extraAttrs = Ux.sorterObject(attrs);
            return (
                <UI {...extraAttrs}/>
            )
        } else return false;
    }
    if (Ux.isFunction(fnJsx)) {
        return fnJsx($inited, reference, fnJsxDefault);
    } else {
        return fnJsxDefault()
    }
}
export default {
    ylCard,         // 带 PageCard 页面专用
    ylDynamic,      // 动态页面专用
    ylTabExtra,     // 表单专用处理
}