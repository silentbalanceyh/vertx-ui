import {Col, Form, Input, Row} from "antd";
import React from "react";
import Dg from "../Ux.Debug";
import Immutable from "immutable";
import Random from "../Ux.Random";
import DFT from "./Ux.Jsx.Default";
import Ai from "../ai/AI";
import Prop from "../Ux.Prop";
import Norm from "../Ux.Normalize";

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
        return getFieldDecorator(each.field, each.optionConfig)(
            render(reference, each.optionJsx, each.optionConfig)
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
    Dg.ensureRender(render, item);
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
const jsxTitle = (item = {}) => (
    <Col className={item.className ? item.className : "page-title"}
         key={item.field} span={item.span ? item.span : 24}>
        {/** 只渲染Title **/}
        {item.title}
    </Col>
);
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
    const {form = [], ...rest} = config;
    // 读取配置数据
    return (
        <div>
            {Norm.extractHidden(reference, key).inputs.map(name => jsxHidden(reference, name, values[name]))}
            {form.map((row, rowIndex) => {
                const rowKey = entity ? `form-row-${entity}-${rowIndex}` : `form-row-${rowIndex}`;
                return (
                    <Row key={rowKey} style={DFT.uiRow(row, rowConfig[rowIndex], config)}>
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
export default {
    jsxHidden,
    jsxTitle,
    jsxGrid,
    jsxColumn,
    jsxItem,
    jsxRow,
}