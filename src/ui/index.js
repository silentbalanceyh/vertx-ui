import Ux from "ux";
import React from "react";
import Ex from 'ex';
import Lg from "lang";
import {PageCard} from "web";
import {ExForm, ExListComplex} from "ei";

const smartOp = (reference, config = {}) => ({
    $opAdd: (formRef) => Ex.form(formRef).addFn(config.A),
    $opSave: (formRef) => Ex.form(formRef).saveFn(config.S),
    $opDelete: (formRef) => Ex.form(formRef).removeFn(config.D)
})

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
                    }
                    if (Ux.isFunction(yoAcl)) {
                        form.$edition = yoAcl(this, normalized);
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

const smartList = (configuration = {}) => {
    const {
        ns,
        name,
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
    if (!name) {
        LOG.off = true;
    }
    const logger = Ex.parserOfColor(name).page(LOG)

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
                            formatted[optionKey] = Ux.formatExpr(options[optionKey], module, true);
                        }
                    });
                    configuration.options = formatted;
                }
                /*
                 * $op, $executor, $plugins
                 */
                if (Ux.isFunction(yoOp)) configuration.$op = yoOp(this);
                if (Ux.isFunction(yoExecutor)) configuration.$executor = yoExecutor(this);
                if (Ux.isFunction(yoPlugins)) configuration.$plugins = yoPlugins(this);
                if (Ux.isFunction(yoRx)) {
                    const rxFn = yoRx(this);
                    Object.keys(rxFn)
                        .filter(name => name.startsWith('rx'))
                        .filter(name => name.startsWith('on'))
                        .filter(name => name.startsWith('fn'))
                        .filter(name => Ux.isFunction(rxFn[name]))
                        .forEach(fnKey => configuration[name] = rxFn[fnKey]);
                }
                /*
                 * ---------------- 外置处理 -----------------
                 */
                if (Ux.isFunction(componentYo)) {
                    configuration = componentYo(this, configuration);
                }
                return (
                    <PageCard reference={this}>
                        <ExListComplex {...Ex.yoAmbient(this)}
                                       config={configuration} $form={form}/>
                    </PageCard>
                )
            }, logger)
        }
    }

    return UI;
}
export default {
    smartForm,      // 快速开表单
    /**
     * ##「组件」`Ex.fastList`
     *
     * 构造List页专用快速开发接口，配置说明
     *
     * {
     *     "Cab": "调用required构造的Cab.json数据",
     *     "Form": {
     *         "表单基本信息，对应 FormEdit, FormAdd, FormFilter",
     *         "如果不包含表单，则使用默认"
     *     }
     * }
     *
     * @memberOf module:_kernel
     * @param {Object} configuration 完整配置程序
     */
    smartList
}