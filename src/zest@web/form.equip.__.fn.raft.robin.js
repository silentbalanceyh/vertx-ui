import __Zn from './zero.module.dependency';
import __STEP_01 from './form.equip.__.fn.raft.01.entry';
import __STEP_02 from './form.equip.__.fn.raft.02.row';
import __STEP_03 from './form.equip.__.fn.raft.03.cell';
import __STEP_04 from './form.equip.__.fn.raft.04.render';
import __CFG from './form.equip.fn._.cab.cap.init';
import __CSS from './form.__.fn.css.uca.polymorphism';
import {_Logger} from 'zo';

const Raft = {
    ...__STEP_01,
    ...__STEP_02,
    ...__STEP_03,
    ...__STEP_04,
}

const __raftMeta = (metadata = {}, cell) => {
    // 不执行（这种情况 field 为 UUID）
    if (cell.title) {
        return;
    }
    /*
     * 搜索表单辅助工具，主要是搜索的时候需要执行值处理
     */
    const {__render, field} = cell;
    if (field && "$button" !== field) {
        if (undefined === __render) {
            metadata.render[field] = "aiInput";
        } else {
            metadata.render[field] = __render;
        }
    }
    if (cell.__render) {
        const errorNotify = __CSS.cssNotify();
        if (errorNotify.includes(cell.__render)) {
            metadata.error_notify.push(cell.field);
        }
    }
}
const configForm = (form, addOn = {}, containerFn, ucaFn) => {
    /*
     * 1）form 配置存在
     * 2）addOn 中包含了 reference
     * 3）form.ui 存在
     */
    if (!form) return __Zn.fxError(10012, 'form');
    if (!addOn.reference) return __Zn.fxError(10049, addOn);
    if (!form.ui) return __Zn.fxError(10056, form.ui);
    /*
     * 2）构造Raft基本配置
     */
    const raft = {form: {}};
    const paramsOut = {form, addOn};
    // Render-1: <Form/> 配置构造
    Raft.raftAttribute(raft, paramsOut);
    const {
        reference,
        metadata = {},
    } = addOn;
    // Render-2: <Input type="hidden"/>
    Raft.raftHidden(raft, form, reference);
    // Render-3：计算 form.ui
    const normalized = Raft.raftUi(reference, form.ui, form.rule);
    // Render-4：计算布局相关信息
    const calculated = Raft.raftLayout(raft, paramsOut);
    raft.rows = [];

    // 自包含处理
    /*
         * 新版处理，unit 的整体结构按功能来划分
         * {
         *     "error_notify": [],
         *     // 提交时触发 notify 认证信息的字段，现阶段 aiDialogEditor
         *     // 后续追加新的
         * }
         */
    // 替换原来的 raft.search 行遍历
    metadata.render = {};
    metadata.error_notify = [];
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
            const column = Raft.raftColumn(raft, __Zn.clone(params));
            /*
             * 处理 title 和 $button
             */
            Raft.raftSpecial(column);
            const $addOn = params.addOn ? params.addOn : {};
            $addOn.metadata = metadata;
            column.__render = cell.render;    // 拷贝原始值，用于元数据分析
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
                if (!__Zn.isFunction(containerFn)) {
                    throw new Error("[ Ux ] 容器模式没有生成正确的 render ")
                }
                const render = containerFn(cell, {
                    ...params,
                    addOn: $addOn,
                }, configForm);
                if (render) {
                    column.render = render;
                } else {
                    throw new Error("[ Ux ] 容器模式没有生成正确的 render ")
                }
            } else {
                column.render = Raft.raftRender(cell, {
                    ...params,
                    addOn: $addOn,
                }, ucaFn);
            }
            rowItem.cells.push(column);
            __raftMeta(metadata, column);
        });
        _Logger.render(5, rowItem, rowIndex);
        raft.rows.push(rowItem);
    });
    raft.enabled = true;
    // eslint-disable-next-line
    {
        /* 权限控制 */
        if (form.op) {
            /* 配置 Raft 对应的 op */
            raft.authorized = __Zn.clone(form.op);
        }
        /* initial 专用配置（初始化） */
        if (form.initial) {
            raft.initial = __Zn.clone(form.initial);
        }
        /* assist 专用 */
        if (form.assist) {
            raft.assist = __Zn.clone(form.assist);
        }
        /* io 专用 */
        if (form.io) {
            raft.io = __Zn.clone(form.io);
        }
        /* metadata */
        if (form.metadata) {
            const $metadata = __Zn.clone(form.metadata);
            $metadata.error_notify = metadata.error_notify.concat($metadata.error_notify);
            $metadata.search = Object.assign($metadata.search, metadata.search);
            raft.metadata = $metadata;
        } else {
            raft.metadata = metadata;
        }
    }
    _Logger.render(3);
    return raft;
};

const raftFormSelf = (reference, containerFn, ucaFn) => {
    /*
     * 返回 Promise
     * 1. 普通功能，capForm
     * 2. 配置功能，configForm
     * 3. 辅助信息，assist 数据处理
     */
    if (reference) {
        const {config = {}, $op = {}} = reference.props;
        const $config = __Zn.clone(config);
        return __CFG.capForm(reference, $config).then((response = {}) => {
            const {form, addOn = {}} = response;
            const raft = configForm(form, addOn, containerFn, ucaFn);
            const state = {};
            state.raft = raft;
            state.$op = $op;
            return __Zn.promise(state);
        }).then(processed => {
            const {raft = {}} = processed;
            let configAssist = __Zn.fromHoc(reference, "assist");
            if (!configAssist) {
                configAssist = {};
            }
            if (raft.assist) {
                Object.assign(configAssist, raft.assist);
            }
            if (!__Zn.isEmpty(configAssist)) {
                return __Zn.asyncAssist(configAssist, reference, processed);
            } else {
                return __Zn.promise(processed);
            }
        });
    }
}


const raftFormConfig = (reference, config, containerFn, ucaFn) => {
    const {
        key = "form",        // 读取 Cab文件的配置，key 默认为 form
        ...rest              // 其他 配置
    } = config;
    const form = __CFG.cabForm(reference, key);
    /*
     * options 专用
     */
    const options = __CFG.capForm(reference, {form}, rest);
    /*
     * 执行 configForm 核心操作
     */
    return options.then(response => {
        const {form, addOn = {}} = response;
        const raft = configForm(form, addOn, containerFn, ucaFn);
        /*
         * 构造 raft
         */
        return __Zn.promise(raft);
    });
}
export default {
    configForm,
    raftFormSelf,
    raftFormConfig
}