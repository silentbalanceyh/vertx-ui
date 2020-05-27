import E from "../../error";
import Abs from '../../abyss';
import Ajax from '../../ajax';

import Parser from '../parser';
import Raft from '../raft';
import Datum from '../datum';
import Fn from '../functions';
import U from 'underscore';

import Logger from '../../develop/logger';


/*
 * ## 引擎函数
 *
 * 配置专用方法，处理当前Form中的input控件专用信息，该配置方法为**上层方法**，直接从
 * 绑定的资源文件`Cab.json`引用的配置中读取相关配置。
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabForm = (reference = {}, key = "form") => {
    const {$hoc} = reference.state;
    E.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    E.fxTerminal(!form, 10056, $hoc);
    return Abs.clone(form);
};
/**
 *
 * ## 引擎函数
 *
 * 配置专用方法，该方法为**下层方法**，直接使用Object作为配置输入。
 *
 * cab: Cab.json 中读取的 form 配置
 *
 * ```json
 * {
 *     form:{
 *          className: "表单对应的CSS",
 *          window: 布局选择,
 *          columns: 使用 grid 时表单支持的布局
 *          ui: 布局信息
 *          hidden: 隐藏字段专用信息
 *          actions: {
 *              op: {
 *                  "Button的id": "SAction的 code"
 *          }
 *     },
 *     control: {
 *          id: "动态创建时的 control id",
 *          magic: {
 *              Ajax专用参数信息
 *          },
 *          uri: "默认远程的 uri",
 *          method: "调用远程的 uri对应的 Ajax 方法，默认 GET"
 *     }
 * }
 * ```
 *
 * program：通过编程方式传入的配置
 *
 * ```json
 * {
 *     key: "form",     // 默认使用 form
 *     jsx: {
 *         "字段名": (reference, jsx) => xxx，渲染函数
 *     },
 *     dynamic:{
 *         renders: {},
 *         extensions: {},
 *     },
 *     columns: （优先）使用 grid 时表单支持的布局,
 *     supplier: （优先）构造 magic 专用的 supplier，和上边的配置结合使用
 * }
 * ```
 *
 * capForm 主要用于设置 addOn 附加信息，最终返回数据结构
 *
 * ```json
 * {
 *     form: {
 *         window,
 *         className,
 *         ui,
 *         hidden,
 *         actions:{
 *             op: {}
 *         }
 *     },
 *     addOn: {
 *         columns:
 *         renders:
 *         dynamic:{
 *             renders: {},
 *             extensions: {}
 *         }
 *     },
 * }
 * ```
 *
 * supplier 响应格式（参考form）
 *
 * ```json
 * {
 *     className: "表单对应的CSS",
 *     window: 布局选择,
 *     columns: 使用 grid 时表单支持的布局
 *     ui: 布局信息
 *     hidden: 隐藏字段专用信息
 *     actions: {
 *     op: {
 *          "Button的id": "SAction的 code"
 *     }
 * }
 * ```
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 基本输入的配置信息。
 * @param {Object} program 编程传入的配置信息。
 * @return {Promise<T>} 返回异步的 Promise。
 */
const capForm = async (reference = {}, config = {}, program = {}) => {
    const addOn = {};
    /*
     * 计算 supplier
     * 1）program 中的 supplier 最优先
     * 2）其次检查动态或静态，如果是
     *   - 静态：() -> config.form;
     *   - 动态：() -> supplier(magic);
     */
    let supplier;
    if (config.form) {
        /*
         * 静态模式
         * form足够
         */
        supplier = () => Abs.promise(config.form);
    } else {
        if (config.control) {
            const {magic = {}, id = "", ...rest} = config.control;
            /*
             * 参数构造
             */
            const params = Parser.parseInput(magic, reference);
            params.control = id;
            /*
             * 提取 generator
             */
            let generator;
            if (program.hasOwnProperty('supplier')) {
                generator = program['supplier'];
                if (U.isFunction(generator)) {
                    supplier = () => generator(params);
                }
            } else {
                supplier = () => Ajax.asyncPromise(rest, params);
            }
        } else {
            console.error(config);      // 检查后端数据
            throw new Error("[ Ux ] Form无法初始化，检查配置数据！")
        }
    }
    /*
     * 1）读取最终 form 的配置
     */
    const form = await supplier();
    /*
     * 2）计算 columns
     */
    const {
        columns = 4, // 默认 4 列
        ...rest
    } = form;
    if (program.hasOwnProperty('columns')) {
        addOn.columns = program.columns;
    } else {
        addOn.columns = columns;
    }
    /*
     * 3）是否包含编程传入的 jsx
     */
    if (program.hasOwnProperty('renders')) {
        addOn.renders = {};
        const {renders = {}} = program;
        Object.keys(renders).filter(key => !!renders[key])
            .filter(key => U.isFunction(renders[key]))
            .forEach(key => addOn.renders[key] = renders[key]);
    }
    /*
     * 4）是否包含了动态信息
     */
    if (program.hasOwnProperty('dynamic')) {
        addOn.dynamic = program.dynamic;
    }
    /*
     * 5）捆绑引用和ID
     */
    const {id = ""} = reference.props;
    addOn.id = id;
    if (!addOn.id) {
        // 修正 id 来源
        if (program.hasOwnProperty("id")) {
            addOn.id = program.id;
        }
    }
    addOn.reference = reference;
    /*
     * 6）权限控制
     */
    // TODO: 权限控制部分，用于控制 $op 的权限信息
    return {
        form: rest,
        addOn
    };
};
/**
 * ## 引擎函数
 *
 * 「标准配置」表单配置的标准处理方法，和 React 隔离的独立配置函数，处理 form 配置专用。
 *
 * @memberOf module:_config
 * @param {Object} form 传入的特殊Form配置，Object类型。
 * @param {Object} addOn 编程专用的Object类型。
 * @return {Object} 配置规范化完成后的Form数据。
 */
const configForm = (form, addOn = {}) => {
    /*
     * 1）form 配置存在
     * 2）addOn 中包含了 reference
     * 3）form.ui 存在
     */
    if (!form) return E.fxError(10012, 'form');
    if (!addOn.reference) return E.fxError(10049, addOn);
    if (!form.ui) return E.fxError(10056, form.ui);
    /*
     * 2）构造Raft基本配置
     */
    const raft = {form: {}};
    const params = {form, addOn};
    // Render-1: <Form/> 配置构造
    Raft.raftAttribute(raft, params);
    const {reference} = addOn;
    // Render-2: <Input type="hidden"/>
    Raft.raftHidden(raft, form, reference);
    // Render-3：计算 form.ui
    const normalized = Raft.raftUi(reference, form.ui);
    // Render-4：计算布局相关信息
    const calculated = Raft.raftLayout(raft, params);
    raft.rows = [];
    /*
     * 行遍历
     */
    raft.search = {};
    normalized.forEach((row, rowIndex) => {
        // 计算行处理信息
        const rowData = Raft.raftRow(raft, {row, index: rowIndex, calculated});
        const {rowItem = {}, rowStyle} = rowData;
        rowItem.cells = [];
        /*
         * 列遍历
         */
        row.forEach((cell, cellIndex) => {
            // 高度修正
            Raft.raftItem(cell, {}, rowStyle);
            /*
             * 解决 rowStyle, 处理Cell和 <Col/>
             */
            const params = {
                cell, index: cellIndex,
                calculated,
                row: {...rowItem, length: row.length, index: rowIndex},
                addOn,
            };
            const column = Raft.raftColumn(raft, Abs.clone(params));
            /*
             * 处理 title 和 $button
             */
            Raft.raftSpecial(column);
            if (cell.complex) {
                /*
                 * 子表单模式（用于静态扩展专用）
                 * 1）key 会发生变化
                 * 2）span 默认为 24
                 */
                column.col.key = `${cell.name}-${rowIndex}-${cellIndex}`;
                if (!cell.hasOwnProperty('span')) {
                    column.col.span = 24;
                }
                const render = Raft.raftContainer(cell, Abs.clone(params), configForm);
                if (render) {
                    column.render = render;
                } else {
                    throw new Error("[ Ux ] 容器模式没有生成正确的 render ")
                }
            } else {
                column.render = Raft.raftRender(cell, Abs.clone(params));
            }
            /*
             * 搜索表单辅助工具，主要是搜索的时候需要执行值处理
             */
            {
                const {render, field} = cell;
                if (field && "$button" !== field) {
                    if (undefined === render) {
                        raft.search[field] = "aiInput";
                    } else {
                        if ("string" === typeof render) {
                            raft.search[field] = render;
                        }
                    }
                }
            }
            rowItem.cells.push(column);
        });
        Logger.render(5, rowItem, rowIndex);
        raft.rows.push(rowItem);
    });
    raft.enabled = true;
    /*
     * 权限控制
     */
    if (form.op) {
        /*
         * 配置 Raft 对应的 op
         */
        raft.authorized = Abs.clone(form.op);
    }
    /*
     * initial 专用配置（初始化）
     */
    if (form.initial) {
        raft.initial = Abs.clone(form.initial);
    }
    Logger.render(3);
    return raft;
};

/**
 * ## 引擎函数
 *
 * 新函数，两种情况
 *
 * 1. 长度为1
 * 2. 长度为2
 *
 * @memberOf module:_config
 * @return {Promise<T>} 返回最终的 Promise。
 */
function raftForm() {
    if (1 === arguments.length) {
        /*
         * 返回 Promise
         * 1. 普通功能，capForm
         * 2. 配置功能，configForm
         * 3. 辅助信息，assist 数据处理
         */
        const reference = arguments[0];
        if (reference) {
            const {config = {}, $op = {}} = reference.props;
            const $config = Abs.clone(config);
            return capForm(reference, $config).then((response = {}) => {
                const {form, addOn = {}} = response;
                const raft = configForm(form, addOn);
                const state = {};
                state.raft = raft;
                state.$op = $op;
                return Abs.promise(state);
            }).then(processed => {
                const assist = Datum.fromHoc(reference, "assist");
                if (assist) {
                    return Fn.asyncAssist(assist, reference, processed);
                } else {
                    return Abs.promise(processed);
                }
            });
        }
    } else if (2 === arguments.length) {
        const reference = arguments[0];
        const config = arguments[1] ? arguments[1] : {};
        const {
            key = "form",        // 读取 Cab文件的配置，key 默认为 form
            ...rest              // 其他 配置
        } = config;
        const form = cabForm(reference, key);
        /*
         * options 专用
         */
        const options = capForm(reference, {form}, rest);
        /*
         * 执行 configForm 核心操作
         */
        return options.then(response => {
            const {form, addOn = {}} = response;
            const raft = configForm(form, addOn);
            /*
             * 构造 raft
             */
            return Abs.promise(raft);
        });
    }
}

export default {
    // cabForm,        // 同步处理
    capForm,        // 异步处理（基本配置）
    configForm,     // 执行 raft 处理
    raftForm,       // Legacy遗留系统
}