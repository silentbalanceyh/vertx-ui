import Ux from "ux";
import Fn from "./generator";

const configGenerator = (onClickStr, reference) => {
    /*
     * 配置必须走 $func 中的绑定流程
     * 1）规范1：该配置必须是一个字符串
     * 2）规范2：如果有多阶，那么应该是：fnName,X，这里的X代表多阶，且不包含空白
     * 3）规范3：最多支持3阶：子、父、爷
     */
    const funcObj = {};
    if (0 < onClickStr.indexOf(',')) {
        const split = onClickStr.split(',');
        funcObj.name = split[0];
        funcObj.level = Ux.valueInt(split[1]);
    } else {
        funcObj.name = onClickStr.onClick;
        funcObj.level = 1;
    }
    /*
     * 从 props 中读绑定寻找函数
     */
    const {$func = {}} = reference.props;
    const generator = $func[funcObj.name];
    let onClick = undefined;
    if (Ux.isFunction(generator)) {
        /*
         * $func 中存在才会有输入源
         */
        if (1 === funcObj.level) {
            /* 1阶函数直接处理 */
            onClick = generator;
        } else if (2 === funcObj.level) {
            /* 2阶函数 */
            const generated = generator(reference);
            if (Ux.isFunction(generated)) {
                onClick = generated;
            }
        } else if (3 === funcObj.level) {
            /* 3阶函数，先读取父引用 */
            const ref = Ux.onReference(reference, 1);
            let generated = generator(ref);
            if (Ux.isFunction(generated)) {
                generated = generated(reference);
                if (Ux.isFunction(generated)) {
                    onClick = generated;
                }
            }
        } else {
            console.error("[ Ex ] 只支持 1,2,3 阶函数，不支持高于 3 阶的函数")
        }
    }
    return onClick;
};

const configConnect = (onClick, plugin = {}, reference) => {
    const {
        connect = false,
        submit = false
    } = plugin;
    if (!onClick) {
        if (submit) {
            if (connect) {
                /*
                 * 如果 fn 中包含了 fnConnect
                 * 同时又是 submit = true
                 */
                onClick = (event) => {
                    Ux.prevent(event);
                    Fn.rx(reference).submitting();
                    Ux.connectId(connect);
                };
            }
        } else {
            if (connect) {
                /*
                 * 如果 fn 中包含了 fnConnect
                 * 同时又是 submit = false
                 */
                onClick = (event) => {
                    Ux.prevent(event);
                    Ux.connectId(connect);
                };
            }
        }
    } else {
        if (submit) {
            /*
             * onClick 本身已经是函数
             */
            const fnOriginal = onClick;
            onClick = (event) => {
                Ux.prevent(event);
                Fn.rx(reference).submitting(true);
                fnOriginal(event);
            }
        }
    }
    return onClick
};
/*
 * 样本
 * 1. 布局行：
 *      - key：React专用
 *      - columns：列中必定包含Col标签
 * 2. 布局列
 *     2.1. 包含行布局（递归节点）
 *      - key：React专用
 *      - rows：列中的行定义
 *      - span：列宽
 *     2.2. 不包含行布局（最子节点）
 *      - key：React专用
 *      - id：列对应的Control的id
 *      - span：列宽
 *      - control：列对应的配置
 * @param item
 * @param prefix
 * @param control
 */

const toColItem = (item, prefix, control = {}) => {
    const column = {};
    column.key = prefix;
    if ("string" === typeof item) {
        column.span = 24;
        column.control = {
            ...control[item],
            id: item,   // control 中带 id
        };
        column.id = item;
    } else {
        column.span = item.span;
        if (Ux.isArray(item.value)) {
            // 列嵌套行
            column.rows = [];
            item.value.forEach((each, index) => column.rows.push(toRowItem(each, prefix + index, control)));
        } else if ("string" === item.value) {
            column.id = item.value;
            column.control = {
                ...control[item.value],
                id: item.value, // control 中带 id
            };
        }
    }
    if (item.xs) column.xs = item.xs;
    if (item.sm) column.sm = item.sm;
    if (item.md) column.md = item.md;
    if (item.lg) column.lg = item.lg;
    if (item.xl) column.xl = item.xl;
    if (item.xxl) column.xxl = item.xxl;
    return column;
};
const toRowItem = (item, prefix, control) => {
    const row = {};
    row.key = prefix;
    if ("string" === typeof item) {
        row.columns = [toColItem(item, prefix, control)];
    } else {
        // 先处理列
        row.columns = [];
        item.forEach((each, index) => row.columns.push(toColItem(each, prefix + index, control)));
    }
    return row;
};

/**
 * ## 「配置」`Ex.configColumn`
 *
 * 表格列扩展配置。
 *
 * @memberOf module:_kernel
 * @param {Array} original 原始列配置
 * @param {Object} config 表格专用输入配置
 * @returns {Array} 返回处理过后的列配置
 */
const configColumn = (original = [], config = {}) => {
    const {columns = [], projections = []} = config;
    /*
     * 合并过后的列存储在当前 $table 变量中
     * Full模式不改变，只做一次初始化
     */
    const normalized = Ux.elementConcat(original, columns, 'dataIndex');
    const resultColumns = [];
    if (0 === projections.length) {
        return normalized;
    } else {
        projections.forEach(key => {
            const column = Ux.elementUnique(normalized, 'dataIndex', key);
            if (column) {
                resultColumns.push(column);
            }
        })
        return resultColumns;
    }
};
/**
 * ## 「配置」`Ex.configGrid`
 *
 * Grid布局扩展配置。
 *
 * @memberOf module:_kernel
 * @param {Array<Array>} grid 矩阵专用扩展Grid布局配置
 * @param {Object} control 控件表
 * @param {String} prefix 前缀信息，用于识别组件的key专用
 * @returns {Array} 返回最终布局
 */
const configGrid = (grid = [], control = {}, prefix) => {
    // 行处理
    const rows = [];
    grid.forEach((item, index) => rows.push(toRowItem(item, prefix + index, control)));
    return rows;
};
/**
 * ## 「配置」`Ex.configRelation`
 *
 * 关系扩展配置，data 中的数据结构：
 *
 * ```json
 * {
 *     "up": [],
 *     "down": []
 * }
 * ```
 *
 * @memberOf module:_kernel
 * @param {Object} data 基本数据信息
 * @param {Object} config 关系完整配置
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 最终的关系配置数据信息
 */
const configRelation = (data = {}, config = {}, reference) => {
    const attrs = {};
    const $data = {};
    if (Ux.isArray(data.down)) {
        $data.down = data.down;
    } else {
        $data.down = [];
    }
    if (Ux.isArray(data.up)) {
        $data.up = data.up;
    } else {
        $data.up = [];
    }
    {
        const onKey = (array = []) => array.forEach(each => {
            if (!each.key) {
                each.key = Ux.randomUUID();
            }
        });
        /*
         * 注入 key 的 uuid 值
         */
        onKey($data.up);
        onKey($data.down);
    }
    attrs.data = $data;
    /*
     * 设置 current 变量
     */
    const current = {};
    current.name = data.name;
    current.code = data.code;
    current.key = data.key;
    current['globalId'] = data['globalId'];
    /*
     * 计算 category 和 identifier
     */
    const {category = {}} = config;
    const {field, source = "data.category"} = category;
    /*
     * hitField
     */
    let hitField;
    const findValue = (fields = []) => {
        let found;
        for (let idx = 0; idx < fields.length; idx++) {
            if (data[fields[idx]]) {
                found = fields[idx];
                break;
            }
        }
        return found;
    };
    if ("string" === typeof field) {
        if (0 <= field.indexOf(',')) {
            const fields = field.split(',');
            hitField = findValue(fields);
        } else {
            hitField = field;
        }
    } else {
        if (Ux.isArray(field)) {
            hitField = findValue(field);
        }
    }
    let $path = {};
    if (data[hitField]) {
        const categoryArray = Ux.onDatum(reference, source);
        const category = Ux.elementUnique(categoryArray, "key", data[hitField]);
        if (category) {
            /*
             * X_CATEGORY 中包含了固定的结构
             */
            current.identifier = category.identifier;
            current.category = category.name;
            current.categoryKey = category.key;
            attrs.current = current;
            /*
             * 只有 category 出现的时候才执行 $path
             * 1）如果 definition 有值，则从 definition 中读取
             * 2）如果 definition = false，则从数据中读取
             */
            $path = Ux.treeFlip(categoryArray, {parent: "parentId", keyField: "identifier"});
        }
    }
    attrs.$path = $path;
    return attrs;
};

/**
 * ## 「配置」`Ex.configClick`
 *
 * 按钮扩展配置。
 *
 * @memberOf module:_kernel
 * @param {Object} config 按钮完整配置
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 返回需要绑定的执行函数
 */
const configClick = (config = {}, reference) => {
    const {
        plugin = {}
    } = config;
    /*
     * 事件第一来源：当前组件的直接配置
     * 1）reference.props -> onClick 优先（最方便模式）
     * 2）config -> onClick 其次（直接配置模式）
     * 3）config -> onClick 为一个 Json 对象，直接使用配置模式
     */
    let onClick;
    if (Ux.isFunction(reference.props.onClick)) {
        onClick = reference.props.onClick;
    } else {
        if (Ux.isFunction(config.onClick)) {
            onClick = config.onClick;
        }
    }
    if (config.onClick && "string" === typeof config.onClick) {
        onClick = configGenerator(config.onClick, reference);
    }
    /*
     * 如果 onClick 已经传入，则不考虑
     * 1）connect 连接点不考虑
     * 2）submit 提交不考虑
     */
    onClick = configConnect(onClick, plugin, reference);
    /*
     * 是否包含 confirm 执行 onClick 的 外围 confirm
     */
    const content = plugin.confirm;
    if (content) {
        onClick = Ux.onConfirm(onClick, content);
    }
    return onClick;
};

/**
 * ## 「配置」`Ex.configDialog`
 *
 * 窗口扩展配置
 *
 * Button / Link 中的 Dialog专用配置，直接的 Dialog不需要配置
 * 转换处理，Dialog的基础配置直接放到 config 变量中
 *
 * 返回数据格式如：
 *
 * ```json
 * {
 *      button: "按钮基本配置",
 *      dialog: "关联窗口配置",
 *      component: "按钮关联组件",
 *      componentConfig: "关联组件配置"
 * }
 * ```
 * @memberOf module:_kernel
 * @param {Object} input 基本输入配置
 * @returns {Object} 返回构造好的配置
 */
const configDialog = (input = {}) => {
    const {component = {}, ...button} = input;
    const dialog = {};
    /*
     * 窗口类型
     */
    dialog.type = component.type;
    /*
     * 窗口配置和 config 合并
     */
    Object.assign(dialog, component.dialog);
    /*
     * 组件和组件配置
     * component /
     * componentConfig
     */
    if ("string" === typeof dialog.onOk) {
        const id = dialog.onOk;
        dialog.onOk = () => Ux.connectId(id);
    }
    /*
     * 包含了 button 的情况，就直接使用 button
     */
    return {
        dialog,
        component: component.component,
        componentConfig: component.config,
        button,
    };
};
export default {
    configClick,
    configDialog,
    configColumn,
    configGrid,
    configRelation,
}