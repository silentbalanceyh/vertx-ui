import {Col, Form, Icon, Input, Row} from "antd";
import React from "react";
import Immutable from "immutable";
import Random from "../util/Ux.Random";
import DFT from "./Ux.Jsx.Default";
import Ai from "../ai/AI";
import Prop from "../prop/Ux.Prop";
import Norm from "../Ux.Normalize";
import Value from '../Ux.Value';
import E from '../Ux.Error';
import U from 'underscore';

const jsxHidden = (reference, name, initialValue) => {
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return getFieldDecorator(name, {
        initialValue
    })(<Input key={name} type={"hidden"}/>)
};

const _getRender = (reference, render) => (each = {}) => {
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    if (0 <= each.field.indexOf("$")) {
        return render(reference, each.optionJsx, each.optionConfig);
    } else {
        const jsx = each.optionJsx ? Immutable.fromJS(each.optionJsx).toJS() : {};
        const config = each.optionConfig ? Immutable.fromJS(each.optionConfig).toJS() : {};
        return getFieldDecorator(each.field, config)(
            render(reference, jsx, config)
        )
    }
};
/**
 * Jsx单行字段的Render处理
 * @method jsxItem
 * @param {React.PureComponent} reference React对应组件引用
 * @param item
 * @param render
 * @return {*}
 */
const jsxItem = (reference, item = {}, render) => {
    E.fxTerminal(!U.isFunction(render), 10059, render, item);
    item = Immutable.fromJS(item).toJS();
    const jsxRender = _getRender(reference, render);
    // $button修正
    if ("$button" === item.field) {
        if (item.optionItem) {
            item.optionItem.labelCol = {span: 0};
            item.optionItem.wrapperCol = {span: 24};
        }
    }
    return item.optionItem ? (
        <Form.Item {...item.optionItem}>
            {jsxRender(item)}
        </Form.Item>
    ) : jsxRender(item)
};
const jsxTitle = (item = {}) => {
    const key = item.key ? item.key : Random.randomString(16);
    return (
        <Col className={item.className ? item.className : "page-title"}
             key={key} span={item.span ? item.span : 24}>
            {/** 只渲染Title **/}
            {item.title}
        </Col>
    )
};
const jsxGrid = (item = {}) => (
    <Col className={item.className ? item.className : "page-title"}
         key={item.field} span={item.span ? item.span : 24}
         style={item.style ? item.style : {}}>
        {/** 只渲染Title **/}
        {item.grid.map(each => (
            <Col span={each.span} key={Random.randomString(12)}
                 style={each.style ? each.style : {}}>
                &nbsp;&nbsp;&nbsp;&nbsp;{each.text}&nbsp;&nbsp;&nbsp;&nbsp;</Col>
        ))}
    </Col>
);
const jsxColumn = (reference, renders, item = {}, layout = {}) => {
    const fnRender = Ai.hookerRender(item, renders, layout, reference);
    if (fnRender) {
        // 渲染
        const {span} = layout;
        return (
            <Col span={item.span ? item.span : span} key={item.field} style={Ai.hookerCol(item)}>
                {/** 渲染字段 **/}
                {jsxItem(reference, item,
                    fnRender ? fnRender : () => false)}
            </Col>
        )
    } else {
        return false;
    }
};
const jsxRow = (reference = {}, renders = {}, column = 4, values = {}, config = {}) => {
    const span = 24 / column;
    // 行配置处理
    const {key = "form", entity} = config;
    let formConfig = Prop.fromHoc(reference, key);
    const rowConfig = formConfig['rowConfig'] ? formConfig['rowConfig'] : {};
    const rowClass = formConfig['rowClass'] ? formConfig['rowClass'] : {};
    const {form = [], ...rest} = config;
    // 计算偏移量
    const adjustCol = Ai.aiAdjust(config.window);
    let spans = [];
    if (adjustCol && adjustCol.row) spans = adjustCol.row[column];
    // 读取配置数据
    return (
        <div>
            {Norm.extractHidden(reference, key).inputs.map(name => jsxHidden(reference, name, values[name]))}
            {form.map((row, rowIndex) => {
                const rowKey = entity ? `form-row-${entity}-${rowIndex}` : `form-row-${rowIndex}`;
                const className = rowClass[rowIndex] ? rowClass[rowIndex] : "";
                return (
                    <Row key={rowKey} style={DFT.uiRow(row, rowConfig[rowIndex], config)}
                         className={className}>
                        {DFT.itRow(row).map((item, cellIndex) => {
                            item = Immutable.fromJS(item).toJS();
                            // 填平高度
                            const rowItem = rowConfig[rowIndex];
                            // 初始化
                            Ai.hookerItem(item, values, rowItem);
                            // 是否改变field信息
                            if (entity) {
                                item.field = `children.${entity}.${item.field}`
                            }
                            // 初始值
                            raftValue(item, values);
                            // span的专用修正
                            if (spans[cellIndex] && !item.span) {
                                item.span = spans[cellIndex];
                            }
                            if (item.hasOwnProperty("title")) {
                                // 单Title
                                return jsxTitle(item);
                            } else if (item.hasOwnProperty('grid')) {
                                return jsxGrid(item);
                            } else {
                                return jsxColumn(reference, renders, item, {
                                    span,
                                    rowIndex,
                                    cellIndex,
                                    columns: DFT.itRow(row).length,
                                    ...rest
                                });
                            }
                        })}
                    </Row>
                )
            })}
        </div>
    );
};
const raftValue = (cell = {}, values = {}) => {
    if (values.hasOwnProperty(cell.field)) {
        let literal = values[cell.field];
        if (cell.moment) {
            if (U.isArray(literal)) {
                const newArray = [];
                literal.forEach(item => newArray.push(Value.convertTime(item)));
                literal = newArray;
            } else {
                literal = Value.convertTime(literal);
            }
        }
        cell.optionConfig.initialValue = literal;
    }
};
const jsxIcon = (item = {}) => {
    if (item.hasOwnProperty("style") && !item.hasOwnProperty("iconStyle")) {
        item.iconStyle = item.style;
        if (item.iconStyle.hasOwnProperty("fontSize")) {
            item.iconStyle.fontSize = Value.valueInt(item.iconStyle.fontSize);
        }
    }
    return (
        <span>
            {item.icon ? (<Icon type={item.icon} style={item.iconStyle}/>) : false}
            &nbsp;&nbsp;
            {item.text || item.label}
        </span>
    )
};
export default {
    jsxHidden,
    jsxTitle,
    jsxGrid,
    jsxColumn,
    jsxIcon,
    jsxItem,
    jsxRow,
    raftValue,
    raftRow: DFT.uiRow,
    raftRender: _getRender
}