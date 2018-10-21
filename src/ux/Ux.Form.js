import Prop from './prop/Ux.Prop';
import E from './Ux.Error';
import Log from './monitor/Mt.Logger';
import Normalize from './Ux.Normalize';
import Ai from './ai/AI';
import Jsx from './Ux.Jsx';
import Value from './Ux.Value';
import React from 'react';
import {Col, Form, Input, Row} from 'antd';

const _raftCell = (reference, values) => (cell) => {
    if (cell.title) {
        const {title, ...cellRest} = cell;
        return (<Col {...cellRest} span={24}>{title}</Col>);
    } else {
        // 子表单
        Jsx.raftValue(cell, values);
        // 目前固定工具栏的field = $button，其他的不做过滤
        return (
            <Col {...cell.col}>
                <Form.Item {...cell.optionItem}>
                    {(cell.render) ? cell.render(cell, reference) : false}
                </Form.Item>
            </Col>
        );
    }
};

const raftField = (reference, values = {}, raft = {}) =>
    raft.rows.map((row) => {
        const {cells = [], ...rowRest} = row;
        // 1. 如果是title
        return (
            <Row {...rowRest}>
                {/** 单元格 **/}
                {cells.map(_raftCell(reference, values))}
            </Row>
        );
    });

const raftHidden = (reference, values = {}, raft = {}, getFieldDecorator) =>
    raft.hidden.inputs.map(name => getFieldDecorator(name, {
        initialValue: values[name]
    })(<Input key={name} type={"hidden"}/>));

const raftInited = (reference, values) => {
    // 初始化数据专用
    if (!values) values = reference.props['$inited'];
    if (!values) values = {};
    return values;
};
const raftJsx = (reference, values) => {
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    const {raft = {}} = reference.state;
    // 初始化数据
    values = raftInited(reference, values);
    return (
        <Form {...raft.form}>
            {/** 隐藏组件 hidden **/}
            {raftHidden(reference, values, raft, getFieldDecorator)}
            {/** 字段渲染 **/}
            {raftField(reference, values, raft)}
        </Form>
    );
};
const raftDynamic = (reference = {}, cell, dynamic = {}, metadata = {}) => {
    // 包含了entity键才会触发该方法
    if (cell.optionJsx && cell.optionJsx.entity) {
        const {entity, key, columns = 4, rowHeight = 32} = cell.optionJsx;
        const configuration = raftForm(reference, dynamic.renders, columns, {
            entity,
            key,
            rowHeight
        });
        // 修改metadata
        if (!metadata.hasOwnProperty('tpl')) {
            metadata.tpl = {};
        }
        metadata.tpl[key] = configuration;
    }
};
const raftForm = (reference = {}, renders = {}, column = 4, config = {}, dynamic = {}) => {
    const {key = "form", entity, ...rest} = config;
    let form = Prop.fromHoc(reference, key);
    // 构造raft配置
    const metadata = {};
    // 1.判断通过配置中的key是否可以取到Form表单的配置信息
    if (!form) {
        return E.fxFailure(10012, key);
    }
    // 1.1.构造Ui专用处理，Form中没有UI
    if (!form.ui) {
        return E.fxFailure(10056, form.ui);
    }
    form = Value.clone(form);
    // 2.计算window，构造新配置
    const window = form.window ? form.window : 1;
    const $config = window ? {...config, window} : config;
    Log.render(1, $config, key);
    // 3.Window专用信息处理
    if (0.5 === window && 2 !== column) {
        return E.fxFailure(10011, column);
    }
    // Render-1: <Form> 配置构造
    metadata.form = {};
    metadata.form.layout = "inline";
    metadata.form.className = form.className ? form.className : "page-form";

    // 处理隐藏组件
    // Render-2: <Input type="hidden"/>
    metadata.hidden = form.hidden ? form.hidden : {inputs: []};

    // 计算默认的span
    const span = 24 / column;

    // 1.ui处理
    const normalized = Normalize.raftUi(reference, form.ui);

    const rowConfig = form['rowConfig'] ? form["rowConfig"] : {};
    const rowClass = form['rowClass'] ? form['rowClass'] : {};
    // 2.偏移量运算
    const adjustCol = Ai.aiAdjust($config.window);
    let spans = [];
    if (adjustCol && adjustCol.row) spans = adjustCol.row[column];
    // 3.列处理
    metadata.rows = [];
    normalized.forEach((row, rowIndex) => {
        // 3.1.行处理
        const rowKey = entity ? `form-row-${entity}-${rowIndex}` : `form-row-${rowIndex}`;
        const rowItem = {};
        rowItem.key = rowKey;

        const rowStyle = rowConfig[rowIndex];
        rowItem.className = rowClass[rowIndex] ? rowClass[rowIndex] : "";
        rowItem.style = Jsx.raftRow(row, rowStyle, $config);
        // 挂载rowHeight
        if (!rowItem.style.hasOwnProperty("height")
            && config.hasOwnProperty("rowHeight")) {
            rowItem.style.minHeight = config.rowHeight;
        }
        rowItem.cells = [];
        // 3.2.单元格处理
        row.forEach((cell, cellIndex) => {
            // 3.2.1.高度填平处理
            Ai.hookerItem(cell, {}, rowStyle);
            // 3.2.2.动态field
            if (entity) {
                cell.field = `children.${entity}.${cell.field}`;
            }
            // 3.2.3.修正span
            if (spans[cellIndex] && !cell.span) {
                cell.span = spans[cellIndex];
            }
            // 3.2.4.处理Render
            const entityConfig = {
                ...rest,
                span, rowIndex, cellIndex,
                columns: row.length,
                window
            };
            if (entity) {
                entityConfig.entity = entity;
            }
            const fnRender = Ai.hookerRender(cell, renders, entityConfig, reference);
            // 3.2.5.针对赋值
            const render = fnRender ? fnRender : () => {
                console.error(`Render未找到，${cell.field}`);
            };
            // 3.2.6.<Col/>处理
            const col = {};
            const colSpan = entityConfig.span;
            col.span = cell.span ? cell.span : colSpan;
            col.key = cell.field;
            col.style = Ai.hookerCol(cell);
            cell.col = col;
            // 3.2.7.封装render生成最终render
            cell.render = Jsx.raftRender(reference, render);
            // 3.2.8.Button处理
            if ("$button" === cell.field) {
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
                if (!cell.className) cell.className = "page-title";
                delete cell.col;
                if (!cell.span) cell.span = 24;
            }
            cell.key = cell.field;
            // 子表单处理，处理子表单模板，但不考虑extensions部分，extensions部分在后期处理
            raftDynamic(reference, cell, dynamic, metadata);
            rowItem.cells.push(cell);
        });
        Log.render(5, rowItem, rowIndex);
        metadata.rows.push(rowItem);
    });
    Log.render(3);
    return metadata;
};
export default {
    raftForm,
    raftJsx,
    raftHidden,
    raftField,
    raftCell: _raftCell
};