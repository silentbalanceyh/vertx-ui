import Ux from "ux";

const raftAttribute = (metadata = {}, {
    form = {}, addon = {}, id,
}) => {
    const window = form.window ? form.window : 1;
    const $config = window ? {...addon, window} : addon;
    Ux.D.Logger.render(1, $config, id);
    metadata.form = {};
    metadata.form.layout = "inline";
    metadata.form.className = form.className ? form.className : "web-form";
    metadata.options = $config;     // 直接注入 addon 到 options
};
const raftHidden = (metadata = {}, {
    form = {}
}) => {
    metadata.hidden = form.hidden ? form.hidden : {inputs: []};
};

const raftCalculated = (metadata = {}, {
    form = {}, addon = {},
}) => {
    // 默认 column 为 4
    const {column = 4, reference, entity, ...rest} = addon;
    const {options = {}} = metadata;
    const span = 24 / column;
    // ui 节点运算
    const normalized = Ux.raptUi(reference, form.ui);
    // 行处理
    const rowConfig = form['rowConfig'] ? form["rowConfig"] : {};
    const rowClass = form['rowClass'] ? form['rowClass'] : {};
    // 偏移量计算
    const adjustCol = Ux.raptAdjust(options.window);
    let spans = [];
    if (adjustCol && adjustCol.row) {
        spans = adjustCol.row[column];
    }
    return {
        span,
        spans,
        rowConfig,
        rowClass,
        normalized,
        entity, // 动态表单专用
        rest,   // addon中的rest剩余属性
        reference,  // 直接传递
    }
};

const raftRow = (metadata, {
    row, index = 0, calculated = {}
}) => {
    const {entity, rowConfig = {}, rowClass = {}} = calculated;
    const rowKey = entity ? `form-row-${entity}-${index}` : `form-row-${index}`;
    const rowItem = {};
    rowItem.key = rowKey;

    const rowStyle = rowConfig[index];
    rowItem.className = rowClass[index] ? rowClass[index] : "";
    rowItem.style = Ux.raptRow(row, rowStyle, metadata.options);
    // 挂载rowHeight
    if (!rowItem.style.hasOwnProperty("height")
        && metadata.options.hasOwnProperty("rowHeight")) {
        rowItem.style.minHeight = metadata.options.rowHeight;
    }
    return {
        rowItem,
        rowStyle,
    };
};

const raftPreCell = (metadata, {
    cell, index = 0,
    calculated = {}, row = {}
}) => {
    const {
        entity, spans = [], rest = {}, span,
        reference
    } = calculated;
    const {options = {}} = metadata;
    // 修正 span
    if (spans[index] && !cell.span) {
        cell.span = spans[index];
    }
    // 处理 render
    const entityConfig = {
        ...rest,
        span,
        rowIndex: row.index,
        cellIndex: index,
        columns: row.length,
        window: options.window,
    };
    // 动态 field（子表单）
    if (entity) {
        cell.field = `children.${entity}.${cell.field}`;
        entityConfig.entity = entity;
    }
    const fnRender = Ux.raptRender(cell, {}, entityConfig, reference);
    // 赋值处理
    const render = fnRender ? fnRender : () => {
        console.error(`Render未找到，${cell.field}`);
    };
    return {
        entityConfig,
        render,
        reference
    }
};
const raftCell = (cell, cellConfig = {}) => {
    const {entityConfig = {}, render, reference} = cellConfig;
    const col = {};
    const {span} = entityConfig;
    col.span = cell.span ? cell.span : span;
    col.key = cell.field;
    col.style = Ux.raptColumn(cell);
    cell.col = col;
    // 封装生成 render
    cell.render = Ux.raptJsx(reference, render);
};
const raftSpecial = (cell = {}) => {
    if ("$button" === cell.field) {  // 特殊按钮
        if (cell.optionItem) {
            if (cell.hidden) {
                cell.optionItem.labelCol = {span: 0};
                cell.optionItem.wrapperCol = {span: 24};
            } else {
                cell.optionItem.label = " ";
                cell.optionItem.colon = false;
            }
        }
    }
    // 特殊删除
    if (cell.title) {
        if (cell.optionItem) delete cell.optionItem;
        if (cell.optionConfig) delete cell.optionConfig;
        if (cell.optionJsx) delete cell.optionJsx;
        if (cell.render) delete cell.render;
        if (!cell.className) cell.className = "ux-title";
        delete cell.col;
        if (!cell.span) cell.span = 24;
    }
    cell.key = cell.field;
};
export default {
    raftAttribute,
    raftHidden,
    raftCalculated,
    raftRow,
    raftPreCell,
    raftCell,
    raftSpecial
}