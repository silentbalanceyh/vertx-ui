import Ex from "ex";
import Ux from "ux";
import React from "react";
import {ExForm, ExListComplex} from "ei";
import Lg from "lang";
import {PageCard} from "web";


const smartOp = (reference, config = {}) => {
    const {
        APre = data => data,
        SPre = data => data,
    } = config;
    return ({
        $opAdd: (formRef) => Ex.form(formRef).addFn(config.A, APre),
        $opSave: (formRef) => Ex.form(formRef).saveFn(config.S, SPre),
        $opDelete: (formRef) => Ex.form(formRef).removeFn(config.D)
    })
}


/**
 * ##「组件」`Ui.smartList`
 *
 * 构造List页专用快速开发接口，配置的数据结构详细说明
 *
 * ```json
 * {
 *     "ns": "调用 require 方法读取 Cab.json设置名空间关联",
 *     "name": "当前页面或组件的名称，如果名称设置了才打印日志，否则直接关闭日志",
 *     "Cab": {
 *         "__COMMENT__": "Cab指定了表单关联的配置值",
 *         "FormAdd": "默认值UI.Add，读取UI.Add.json配置文件，读取资源文件",
 *         "FormEdit": "默认值UI.Edit, 读取UI.Edit.json配置文件，读取资源文件",
 *         "FormFilter": "默认值UI.Filter，读取UI.Filter.json配置文件，读取资源文件",
 *     },
 *
 *     "componentInit": "componentDidMount注入函数，(reference)",
 *     "componentUp": "componentDidUpdate注入函数，(reference, previous)",
 *     "componentYo": "render注入函数，(reference, inherit)",
 *     "componentValue": "render注入函数，执行初始值重新计算"
 *
 *     "yoOp": "注入 $op 变量",
 *     "yoPlugins": "注入 $plugins 变量",
 *     "yoExecutor": "注入 $executor 变量",
 *     "yoAcl": "用来构造 $edition 变量",
 *     "yoRx": "捕捉所有 rx 前缀下的函数注入",
 *
 *     "renderAddOn": "额外的渲染"
 * }
 * ```
 *
 * @memberOf module:smart/ui
 * @param {Object} configurationForm 完整配置程序
 * @param {String} mode 表单模式，主要：ADD | EDIT
 * @return {Component}
 */
const smartForm = (configurationForm = {}, mode) => {
    const {
        ns,
        name,
        Cab = {},
        componentInit,
        componentValue,
        componentUp,
        componentYo,

        yoOp,
        yoJsx,
        yoAcl,
        yoPlugins,
    } = configurationForm;
    let form;
    const {
        FormAdd = "UI.Add",
        FormEdit = "UI.Edit",
        FormFilter = "UI.Filter",
    } = Cab;
    if (Ex.Mode.ADD === mode) {
        form = FormAdd;
    } else if (Ex.Mode.EDIT === mode) {
        form = FormEdit;
    } else if (Ex.Mode.FILTER === mode) {
        form = FormFilter;
    }
    if (undefined === form) {
        return false;
    } else {

        /*
         * ---------------- 表单 -----------------
         */
        const zConfig = Ux.rxEtat(ns).cab(form);
        if (!componentInit) {
            zConfig.ready(true)
        }

        /*
         * ---------------- 日志部分 -----------------
         */
        const LOG = {}
        if (!name) {
            LOG.off = true;
        }
        const logger = Ex.parserOfColor(name).form(LOG)

        @Ux.zero(zConfig.to())
        class UI extends React.Component {

            componentDidMount() {
                if (Ux.isFunction(componentInit)) {
                    componentInit(this);
                }
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                if (Ux.isFunction(componentUp)) {
                    const previous = {props: prevProps, state: prevState};
                    componentUp(this, previous)
                }
            }

            render() {
                return Ex.yoRender(this, () => {
                    const {$inited = {}} = this.props;
                    let normalized = Ux.clone($inited);
                    if (Ux.isFunction(componentValue)) {
                        normalized = componentValue(this, normalized)
                    }
                    let form = Ex.yoForm(this, null, normalized);
                    if (Ux.isFunction(componentYo)) {
                        form = componentYo(this, form);
                    }
                    // --- $op / $renders
                    if (Ux.isFunction(yoOp)) {
                        form.$op = yoOp(this);
                    } else if (Ux.isObject(yoOp)) {
                        form.$op = smartOp(this, yoOp)
                    }
                    if (Ux.isFunction(yoJsx)) {
                        form.$renders = yoJsx(this);
                    } else if (Ux.isObject(yoJsx)) {
                        form.$renders = yoJsx;
                    }
                    if (Ux.isFunction(yoAcl)) {
                        form.$edition = yoAcl(this, normalized);
                    }
                    if (Ux.isFunction(yoPlugins)) {
                        form.$plugins = yoPlugins(this);
                    }
                    return (
                        <ExForm {...form} $height={"300px"}/>
                    )
                }, logger)
            }
        }

        return UI;
    }
}

/**
 * ##「组件」`Ui.smartList`
 *
 * 构造List页专用快速开发接口，配置的数据结构详细说明
 *
 * ```json
 * {
 *     "ns": "调用 require 方法读取 Cab.json设置名空间关联",
 *     "name": "当前页面或组件的名称，如果名称设置了才打印日志，否则直接关闭日志",
 *     "logger": "日志类型",
 *     "Cab": {
 *         "__COMMENT__": "Cab指定了表单关联的配置值",
 *         "page": "默认值UI，读取UI.json配置数据，主要用来指定当前页面读取的默认资源文件配置"
 *     },
 *     "Options": {
 *         "__COMMENT__": "关闭 options 专用配置，下边枚举了常用配置，直接关闭选项更改列表",
 *         "rm":[
 *             "form.add                - 关闭添加表单（表单级关闭）",
 *             "form.edit               - 关闭编辑表单（表单级关闭）",
 *             "form.filter             - 关闭查询表单（高级搜索）",
 *             "op.open.add             - 关闭列表`添加`按钮",
 *             "op.extra.export         - 关闭列表`导出`按钮",
 *             "op.extra.import         - 关闭列表`导入`按钮",
 *             "op.extra.column         - 关闭列表`列更改`按钮",
 *             "op.batch.delete         - 关闭列表`批量删除`按钮",
 *             "op.batch.edit           - 关闭列表`批量更新`按钮",
 *             "op.submit.add           - 表单页`添加`按钮",
 *             "op.submit.save          - 表单页`保存`按钮",
 *             "op.submit.delete        - 表单页`删除`按钮",
 *             "op.submit.reset         - 表单页`重置`按钮"
 *         ]
 *     },
 *     "Form": {
 *         "FormAdd": "form.add启用时生效，添加表单，内置调用 smartForm，如果 FormAdd 是组件优先",
 *         "FormEdit": "form.edit启用时生效，编辑表单，内置调用 smartForm，如果 FormEdit 是组件优先",
 *         "FormFilter": "form.filter启用时生效，查询表单，内置调用 smartForm，如果 FormFilter 是组件优先"
 *     },
 *     "componentInit": "componentDidMount注入函数，(reference)",
 *     "componentUp": "componentDidUpdate注入函数，(reference, previous)",
 *     "componentYo": "render注入函数，(reference, inherit)",
 *
 *     "yoOp": "注入 $op 变量",
 *     "yoPlugins": "注入 $plugins 变量",
 *     "yoExecutor": "注入 $executor 变量",
 *     "yoRx": "捕捉所有 rx 前缀下的函数注入",
 *
 *     "renderAddOn": "额外的渲染"
 * }
 * ```
 *
 * @memberOf module:smart/ui
 * @param {Object} configuration 完整配置程序
 * @return {Component}
 */
const smartList = (configuration = {}) => {
    const {
        ns,
        name,
        logger = "page",
        Cab = {},
        Options = {},
        Form = {},

        componentInit,
        componentUp,
        componentYo,

        yoOp,
        yoPlugins,
        yoExecutor,
        yoRx,
        yoRenders,

        renderAddOn,
    } = configuration;
    const {
        rm = []
    } = Options;
    const {
        page = "UI"
    } = Cab;

    const zConfig = Ux.rxEtat(ns).cab(page);
    if (!componentInit) {
        zConfig.ready(true)
    }
    /*
     * ---------------- 表单 -----------------
     */
    const {
        FormAdd,
        FormEdit,
        FormFilter
    } = Form;
    const $Form = Ux.clone(Form);
    $Form.ns = ns;
    const form = {}
    // form.add
    if (!rm.includes("form.add")) {
        if (FormAdd) {
            form.FormAdd = FormAdd;
        } else {
            form.FormAdd = smartForm($Form, Ex.Mode.ADD);
        }
    }
    // form.edit
    if (!rm.includes("form.edit")) {
        if (FormEdit) {
            form.FormEdit = FormEdit;
        } else {
            form.FormEdit = smartForm($Form, Ex.Mode.EDIT);
        }
    }
    // form.filter
    if (!rm.includes("form.filter")) {
        if (FormFilter) {
            form.FormFilter = FormFilter;
        } else {
            form.FormFilter = smartForm($Form, Ex.Mode.FILTER);
        }
    }
    /*
     * ---------------- 日志部分 -----------------
     */
    const LOG = {}
    let loggerObj = {};
    if (!name) {
        LOG.off = true;
    }
    loggerObj = Ex.parserOfColor(name);
    const loggerConfiguration = loggerObj[logger](LOG);

    @Ux.zero(zConfig.to())
    class UI extends React.Component {
        componentDidMount() {
            if (Ux.isFunction(componentInit)) {
                componentInit(this);
            }
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            if (Ux.isFunction(componentUp)) {
                const previous = {props: prevProps, state: prevState};
                componentUp(this, previous)
            }
        }

        render() {
            return Ex.yoRender(this, () => {
                /*
                 * ---------------- Grid -----------------
                 */
                const config = Ux.fromHoc(this, "grid");
                // Combine Tpl and config
                const configTpl = Lg(`extension/tpl/ExComplexList`)
                const {_grid = {}} = configTpl;
                // configuration
                let configuration = Ux.assign(_grid, config, 1);
                const {module = {}} = config;
                const options = configuration.options;
                if (options) {
                    const formatted = {};
                    Object.keys(options).forEach(optionKey => {
                        if (!rm.includes(optionKey)) {
                            if ("string" === typeof options[optionKey]) {
                                formatted[optionKey] = Ux.formatExpr(options[optionKey], module, true);
                            } else {
                                formatted[optionKey] = options[optionKey];
                            }
                        }
                    });
                    configuration.options = formatted;
                }
                /*
                 * $op, $executor, $plugins
                 */
                let inherit = Ex.yoAmbient(this);
                if (Ux.isFunction(yoOp)) inherit.$op = yoOp(this);
                if (Ux.isFunction(yoExecutor)) inherit.$executor = yoExecutor(this);
                if (Ux.isFunction(yoPlugins)) inherit.$plugins = yoPlugins(this);
                if (Ux.isFunction(yoRenders)) inherit.$renders = yoRenders(this);
                if (Ux.isFunction(yoRx)) {
                    const rxFn = yoRx(this);
                    Object.keys(rxFn)
                        .filter(Ux.isFunctionName)
                        .filter(fnKey => Ux.isFunction(rxFn[fnKey]))
                        .forEach(fnKey => inherit[fnKey] = rxFn[fnKey]);
                }
                if (Ux.isFunction(componentYo)) {
                    inherit = componentYo(this, inherit);
                }
                /*
                 * 是否内置容器，内置容器会导致无 PageCard
                 */
                const isContainer = options[Ex.Opt.TABS_CONTAINER];
                if (isContainer) {
                    // tabs.container = true
                    return (
                        <PageCard reference={this}>
                            <ExListComplex {...inherit}
                                           config={configuration} $form={form}/>
                            {Ux.isFunction(renderAddOn) ? renderAddOn(this) : false}
                        </PageCard>
                    )
                } else {
                    // tabs.container = false
                    return (
                        <PageCard reference={this}>
                            <ExListComplex {...inherit}
                                           config={configuration} $form={form}/>
                            {Ux.isFunction(renderAddOn) ? renderAddOn(this) : false}
                        </PageCard>
                    )
                }
            }, loggerConfiguration)
        }
    }

    return UI;
}
export default {
    smartForm,
    smartList
}