import Ux from "ux";
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

const __configItemCol = (item, prefix, control = {}) => {
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
            item.value.forEach((each, index) => column.rows.push(__configItemRow(each, prefix + index, control)));
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
const __configItemRow = (item, prefix, control) => {
    const row = {};
    row.key = prefix;
    if ("string" === typeof item) {
        row.columns = [__configItemCol(item, prefix, control)];
    } else {
        // 先处理列
        row.columns = [];
        item.forEach((each, index) => row.columns.push(__configItemCol(each, prefix + index, control)));
    }
    return row;
};
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
const configGrid = (grid = [], control = {}, prefix) => {
    // 行处理
    const rows = [];
    grid.forEach((item, index) => rows.push(__configItemRow(item, prefix + index, control)));
    return rows;
};
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
    configDialog,
    configColumn,
    configGrid,
    configRelation,
}