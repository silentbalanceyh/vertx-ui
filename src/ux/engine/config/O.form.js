import E from "../../error";
import Abs from '../../abyss';
import Ajax from '../../ajax';

import Parser from '../parser';
import Raft from '../raft';
import U from 'underscore';

import Logger from '../../develop/logger';


/**
 * 处理当前Form中的input控件专用信息
 * @method extractForm
 * @param reference React对应组件引用 React.PureComponent
 * @param key 读取的配置值
 * @return {*}
 * 上层方法，直接从 cab.json 中读取
 */
const cabForm = (reference = {}, key = "form") => {
    const {$hoc} = reference.state;
    E.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    E.fxTerminal(!form, 10056, $hoc);
    return Abs.clone(form);
};
/*
 * 下层方法
 * cab: Cab.json 中读取的 form 配置
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
 * program：通过编程方式传入的配置
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
 * capForm 主要用于设置 addOn 附加信息，最终返回数据结构
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
 * supplier 响应格式（参考form）
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
            throw new Error("[ Ux ] Form无法初始化！")
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
    if (program.hasOwnProperty('jsx')) {
        addOn.renders = {};
        const {jsx = {}} = program;
        Object.keys(jsx).filter(key => !!jsx[key])
            .filter(key => U.isFunction(jsx[key]))
            .forEach(key => addOn.renders[key] = jsx[key]);
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
                 */
                column.col.key = `${cell.name}-${rowIndex}-${cellIndex}`;
                const render = Raft.raftContainer(cell, Abs.clone(params), configForm);
                if (render) {
                    column.render = render;
                } else {
                    throw new Error("[ Ux ] 容器模式没有生成正确的 render ")
                }
            } else {
                column.render = Raft.raftRender(cell, Abs.clone(params));
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

/*
 * 原生的RaftForm改变过来的
 */
const raftForm = (reference, config = {}) => {
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
};
export default {
    cabForm,        // 同步处理
    capForm,        // 异步处理（基本配置）
    configForm,     // 执行 raft 处理
    raftForm,       // Legacy遗留系统
}