import {LoadingAlert, PageCard} from "web";
import React from "react";
import Ux from "ux";
import __Zn from './zero.module.dependency';

const ylCard = (reference, fnRender, config = {}) => {
    const {
        title, extra, header,
        leftVisible = true,
        ...LOG
    } = config;
    return __Zn.yoRender(reference, () => {
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

const isSatisfy = (reference, view = __Zn.Mode.LIST) => {
    const {options = {}} = reference.state;
    if (__Zn.Mode.LIST !== view) {
        /*
         * 如果是添加
         */
        if (__Zn.Mode.ADD === view) {
            /*
             *  ADD 添加视图
             *  tabs.extra.add 键值
             *  1）如果没有该值，则显示
             *  2）如果有该值，那么该值必须存在
             */
            if (options.hasOwnProperty(__Zn.Opt.TABS_EXTRA_ADD)) {
                return !!options[__Zn.Opt.TABS_EXTRA_ADD];
            } else return true;  // 不设置直接 true
        } else if (__Zn.Mode.EDIT === view) {
            /*
             *  EDIT 编辑视图
             *  tabs.extra.edit 键值
             *  1）如果没有该值，则显示
             *  2）如果有该值，那么该值必须存在
             */
            if (options.hasOwnProperty(__Zn.Opt.TABS_EXTRA_EDIT)) {
                return !!options[__Zn.Opt.TABS_EXTRA_EDIT];
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
EXECUTOR_EXTRA[__Zn.Mode.EDIT] = "rxExtraEdit";
EXECUTOR_EXTRA[__Zn.Mode.ADD] = "rxExtraAdd";
EXECUTOR_EXTRA[__Zn.Mode.LIST] = "rxExtraList";
EXECUTOR_EXTRA[__Zn.Mode.FILTER] = "rxExtraFilter";
const ylTabExtra = (reference, tabs = {}, UI) => {
    /*
     * 提交状态
     * state -> $submitting
     * state -> view
     */
    const {
        $submitting = false,
        $view = __Zn.Mode.LIST,
        $inited = {}
    } = reference.state;
    const fnKey = EXECUTOR_EXTRA[$view];
    const fnJsx = reference.props[fnKey];
    const fnJsxDefault = () => {
        if (isSatisfy(reference, $view)) {
            /*
             * 1.添加流程
             * 2.编辑流程
             * 双流程单独处理
             */
            const prefix = __Zn.Mode.ADD === $view ? "op.add" : "op.edit";
            /*
             * 特殊配置
             * 1）tab.extra.add
             * 2）tab.extra.edit
             */
            const attrs = __Zn.yoAction(reference, prefix, __Zn.Order);
            /*
             * 扩展执行
             */
            attrs.config = __Zn.yoExtension(reference, `op.submit.${$view}`, attrs.config);
            /*
             * 编辑界面核心操作
             */
            if (__Zn.Mode.EDIT === $view) {
                /*
                 * 设置可编辑的基础关系
                 */
                setEdition(attrs, reference);
                attrs.config = Ux.pluginKoEdit(reference, $inited, attrs.config);
                /* 处理 config */
                if (attrs.config && 1 === attrs.config.length) {
                    /*
                     * 单 reset 不呈现
                     * 此种情况只有一个 RESET 按钮，直接过滤掉
                     ***/
                    attrs.config = attrs.config.filter(item => "op.submit.reset" !== item.category);
                }

            } else {
                attrs.config = Ux.pluginKoAdd(reference, $inited, attrs.config);
            }
            /*
             * 显示删除按钮
             */
            if (0 === attrs.config.length) {
                const {options = {}} = reference['state'];
                /*
                 * op.submit.close 只有在没有任何按钮存在时才会出现
                 * 且除了文字可以更改，其他内容目前版本全程固定
                 */
                if (options['op.submit.close']) {
                    const button = {
                        icon: 'close-circle',
                        className: "uc_pink",
                        key: "opFormClose",
                        text: options['op.submit.close']
                    }
                    button.onClick = (event) => {
                        Ux.prevent(event);
                        __Zn.rxTabClose(reference)($inited.key, {
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