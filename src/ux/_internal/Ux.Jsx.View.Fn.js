import U from "underscore";
import Random from "../Ux.Random";
import {Col, Row} from "antd";
import React from "react";
import viewRender from "./Ux.Jsx.View";
import Prop from "../Ux.Prop";
import DFT from './Ux.Jsx.Default';

/**
 * 渲染某一个Column的内容信息
 * @method viewColumn
 * @param column
 * @param content
 */
const viewColumn = (column, content) => {
    let attrs = {};
    if (U.isObject(column)) {
        // 可传入Object配置
        attrs = Object.assign(attrs, column);
    } else {
        // 如果传入不是Object，则使用默认的span属性
        attrs.span = column;
    }
    attrs.key = Random.randomString(16);
    return (
        <Col {...attrs}>
            {U.isFunction(content) ? content() : content}
        </Col>
    )
};
/**
 * 渲染某一个Row的内容
 * @method viewRow
 * @param columns
 * @param flex
 * @param content
 */
const viewRow = (columns = [], flex = {}, ...content) => {
    const attrs = {
        key: Random.randomString(16),
        className: "page-view"
    };
    if (flex.isSub) {
        attrs.className = "page-viewsub"
    }
    return (flex.show && 0 < columns.length) ? (
        <Row {...attrs}>
            {columns.map((column, index) => viewColumn(column, content[index]))}
        </Row>
    ) : false
};
/**
 * 渲染某一个Row的Title
 * @method viewTitle
 * @param message
 */
const viewTitle = (message) => {
    return (<Row className={"page-title"}>{message}</Row>)
};
/**
 * 渲染某一个Row的Header
 * @method viewHeader
 * @param message
 */
const viewHeader = (message) => {
    return (<Row className={"page-view-header"}>{message}</Row>)
};

/**
 * 渲染某一个单元格，主要用于处理上边的content
 * @param reference
 * @param $data
 * @param field
 * @param config
 * @param renders
 */
const viewCell = (reference, $data, field = "Unknown", config = {}, renders = {}) => {
    let render = renders[field];
    if (!U.isFunction(render)) {
        render = viewRender[config.mode];
        config.extension = renders[field];
    }
    if (!render) {
        console.error("[ZERO] View render does not exist.", config.mode);
    }
    return (U.isFunction(render)) ? render($data, config, reference) : false;
};

const viewConfig = (page = [], reference, key = "view") => {
    const view = Prop.fromHoc(reference, key);
    const configMap = {};
    page.forEach(row => row.name.forEach(field => {
        if (!view || !view[field]) {
            console.error("[ZERO] Required 'view' config missing.", field)
        }
        configMap[field] = DFT.uiView(view[field], field);
    }));
    return configMap;
};

const viewGrid = (page = [], reference, $data, renders = {}, key = "view", isSub = false) => {
    const configMap = viewConfig(page, reference, key);
    // 计算当前行是否呈现，动态配置扩展专用
    page.forEach(row => {
        if (row.flex && row.flex.row) {
            row.name.forEach(field => {
                const config = configMap[field];
                const value = viewRender.extractValue($data, config);
                row.flex.show = !!value;
            })
        } else {
            row.flex = {};
            row.flex.show = true;
        }
        row.flex.isSub = isSub;
    });
    return page.map(row => viewRow.apply(null,
        [row.span, row.flex].concat(row.name.map(
            field => viewCell(reference, $data, field, configMap[field], renders)
        )))
    )
};
export default {
    viewColumn,
    viewTitle,
    viewRow,
    viewCell,
    viewGrid,
    viewConfig,
    viewHeader,
}