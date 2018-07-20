import React from 'react';
import Random from './Ux.Random'
import Norm from './Ux.Normalize'
import Prop from './Ux.Prop'
import viewRender from './_internal/Ux.View'
import {Button, Col, Form, Input, Row} from 'antd'
import Dg from './Ux.Debug'
import Immutable from 'immutable';
import U from 'underscore';
import Ai from './ai/AI';

/**
 * 验证规则属性
 * message：校验文件
 * type: 可选（内建类型）
 * required：是否必填
 * len:字段长度
 * min:最小长度
 * max:最大长度
 * enum: 枚举类型
 * pattern:正则表达式校验
 * transform:校验前转换字段值
 * validator: 自定义校验
 * @method _uiDisplay
 * @private
 * @param row 显示行数据
 * @param addition 额外风格
 * **/
const _uiDisplay = (row = {}, addition = {}) => {
    const style = row.style ? row.style : {};
    if (1 === row.length) {
        // 单按钮
        const item = row[0];
        if (item.hidden) {
            if (item.field === "$button") {
                style.display = "none";
            }
        }
        // 标题单行修正间距专用
        if (item.title) {
            style.height = `42px`;
        }
    }
    return Object.assign(addition, style);
};
const _uiRow = (row) => {
    if (Array.prototype.isPrototypeOf(row)) {
        return row;
    } else {
        return row.items ? row.items : [];
    }
};
const _optionFormItem = (item = {}) => {
    return (item.labelCol) ? item : {
        ...item,
        style: {
            width: "90%"
        },
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    }
};
/**
 * Jsx单字段的Render处理
 * @method jsxField
 * @param {React.PureComponent} reference React对应组件引用
 * @param item Form中的Item配置信息
 * @param render 专用render函数
 * @return {*}
 */
const jsxField = (reference, item = {}, render) => {
    Dg.ensureRender(render, item);
    item = Immutable.fromJS(item).toJS();
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    const jsxRender = (each = {}) => {
        if (0 <= each.field.indexOf("$")) {
            return render(reference, each.optionJsx, each.optionConfig);
        } else {
            return getFieldDecorator(each.field, each.optionConfig)(
                render(reference, each.optionJsx, each.optionConfig)
            )
        }
    };
    return item.optionItem ? (
        <Form.Item {..._optionFormItem(item.optionItem)}>
            {jsxRender(item)}
        </Form.Item>
    ) : jsxRender(item)
};

const jsxHidden = (reference, name, initialValue) => {
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return getFieldDecorator(name, {
        initialValue
    })(<Input key={name} type={"hidden"}/>)
};
/**
 * Jsx单行字段的Render处理
 * @method jsxFieldRow
 * @param {React.PureComponent} reference React对应组件引用
 * @param item
 * @param render
 * @return {*}
 */
const jsxFieldRow = (reference, item = {}, render) => {
    Dg.ensureRender(render, item);
    item = Immutable.fromJS(item).toJS();
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return (
        <Form.Item {...item.optionItem}>
            {getFieldDecorator(item.field, item.optionConfig)(
                render(reference, item.optionJsx))}
        </Form.Item>
    )
};
const _jsxFieldGrid = (item = {}) => {
    return (
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
    )
};
const _jsxFieldTitle = (item = {}) => (
    <Col className={item.className ? item.className : "page-title"}
         key={item.field} span={item.span ? item.span : 24}>
        {/** 只渲染Title **/}
        {item.title}
    </Col>
);
const _jsxFieldCommon = (reference, renders, item = {}, layout = {}) => {
    const fnRender = Ai.hookerRender(item, renders, layout);
    if (fnRender) {
        // 渲染
        const {span} = layout;
        return (
            <Col span={item.span ? item.span : span} key={item.field} style={Ai.hookerCol(item)}>
                {/** 渲染字段 **/}
                {jsxField(reference, item,
                    fnRender ? fnRender : () => false)}
            </Col>
        )
    } else {
        return false;
    }
};
const _jsxField = (reference = {}, renders = {}, column = 4, values = {}, form = {}) => {
    const span = 24 / column;
    // 行配置处理
    const formConfig = Prop.fromHoc(reference, "form");
    const rowConfig = formConfig['rowConfig'] ? formConfig['rowConfig'] : {};
    const hiddens = Norm.extractHidden(reference);
    // 读取配置数据
    return (
        <div>
            {hiddens.inputs.map(name => jsxHidden(reference, name, values[name]))}
            {form.map((row, rowIndex) => (
                <Row key={`form-row-${rowIndex}`} className="debug-row" style={_uiDisplay(row, rowConfig[rowIndex])}>
                    {_uiRow(row).map((item, cellIndex) => {
                        item = Immutable.fromJS(item).toJS();
                        // 填平高度
                        const rowItem = rowConfig[rowIndex];
                        // 初始化
                        Ai.hookerItem(item, values, rowItem);
                        if (item.hasOwnProperty("title")) {
                            // 单Title
                            return _jsxFieldTitle(item);
                        } else if (item.hasOwnProperty('grid')) {
                            return _jsxFieldGrid(item);
                        } else {
                            return _jsxFieldCommon(reference, renders, item, {
                                span,
                                rowIndex,
                                cellIndex
                            });
                        }
                    })}
                </Row>
            ))}
        </div>
    );
};
/**
 * 仅渲染交互式组件，Grid布局
 * @method jsxFieldGrid
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @return {boolean}
 */
const jsxFieldGrid = (reference = {}, renders = {}, column = 4, values = {}) => {
    // Fix Issue
    if (!values) values = {};
    const form = Norm.extractForm(reference);
    return _jsxField(reference, renders, column, values, form);
};
/**
 * 分组渲染交互式控件
 * @method jsxFieldGroup
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @param groupIndex 当前需要渲染的group的组
 * @return {boolean}
 */
const jsxFieldGroup = (reference = {}, renders = {}, column = 4, values = {}, groupIndex) => {
    // Fix Issue
    if (!values) values = {};
    const form = Norm.extractGroupForm(reference, groupIndex);
    return _jsxField(reference, renders, column, values, form);
};
/**
 * 仅渲染按钮
 * @method jsxOp
 * @param reference
 * @param column
 * @param op
 * @return {boolean}
 */
const jsxOp = (reference = {}, column = 4, op = {}) => {
    const ops = Norm.extractOp(reference, op);
    const hidden = Norm.extractHidden(reference);
    const span = 24 / column;
    const btnOpts = _optionFormItem();
    btnOpts.label = ' ';
    btnOpts.colon = false;
    const opStyle = {};
    if (hidden.op) {
        opStyle.display = "none"
    }
    return (ops && 0 < ops.length ? (
        <Row style={opStyle}>
            <Col span={span}>
                <Form.Item {...btnOpts}>
                    {ops.map(op => <Button {...op}>{op.text}</Button>)}
                </Form.Item>
            </Col>
        </Row>
    ) : false)
};
/**
 * 针对Form进行分行渲染专用方法，可按照Grid的布局进行渲染
 * @method uiFieldForm
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param column 当前Form的列数量
 * @param values Form的初始化值
 * @param op 追加方法
 * @return {*}
 */
const uiFieldForm = (reference = {}, renders = {}, column = 4, values = {}, op = {}) => {
    // Fix Issue
    if (!values) values = {};
    return (
        <Form layout="inline" className="page-form">
            {jsxFieldGrid(reference, renders, column, values)}
            {jsxOp(reference, column, op)}
        </Form>
    )
};

/**
 * 渲染某个子表单的Page页
 * @method jsxFieldPage
 * @param {React.PureComponent} reference React对应组件引用
 * @param renders 每个字段不同的render方法
 * @param jsx 当前Form的列数量
 * @param entity Form的初始化值
 * @param key 读取配置的专用
 * @return {boolean}
 */
const jsxFieldPage = (reference, renders, jsx, entity = {}, key) => {
    // 行配置处理
    const formCfg = Norm.extractForm(reference, key);
    return formCfg.map((row, index) => (
        <Row key={`form-range-row-${index}`} style={{height: 39}}>
            {row.map(item => {
                // 初始化
                const $item = Immutable.fromJS(item).toJS();
                $item.field = `children.${entity.key}.${item.field}`;
                return (
                    <Col span={item.span ? item.span : 8} key={$item.field}>
                        {jsxField(reference, $item, renders[item.field])}
                    </Col>
                )
            })}
        </Row>
    ));
};
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

const _prepareConfig = (config = {}, field) => {
    // 智能格式兼容
    if ("string" === typeof config) {
        const splitted = config.split(',');
        if (2 === splitted.length) {
            const key = splitted[0];
            const label = splitted[1];
            const target = {};
            target.field = field;
            target.label = label;
            if (key !== field) {
                target.path = key;
            }
            config = target;
        } else {
            const target = {};
            target.field = field;
            target.label = splitted[0];
            config = target;
        }
    } else if (true === config) {
        const target = {};
        target.field = field;
        config = target;
    }
    config = Immutable.fromJS(config).toJS();
    if (!config.mode) config.mode = "pure";
    if (!config.meta) config.meta = {};
    if (!config.field) config.field = field;
    return config;
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
        configMap[field] = _prepareConfig(view[field], field);
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
/**
 * 特殊方法：双高阶函数的渲染
 * @param reference
 */
const jsxOpArchor = (reference) => {
    const {$op = {}} = reference.props;
    const keys = Object.keys($op);
    const style = {display: "none"};
    return keys.map(key => (
        <Button id={key} key={key} onClick={$op[key](reference)} style={style}/>
    ))
};
/**
 * @class Jsx
 * @description 字段专用输出函数
 */
export default {
    // Form专用
    uiFieldForm,
    // -------------- 以上为Form内置 ---------------
    viewColumn,
    viewTitle,
    viewRow,
    viewCell,
    viewGrid,
    viewConfig,
    viewHeader,
    // -------------- 以上为View内置 ---------------
    /**
     * 登录页这种单列布局使用
     * 配置文件格式【一维数组】
     * "_form":{
     *     "ui":[
     *         {
     *         }
     *     ]
     * }
     */
    jsxFieldRow,
    /**
     * Grid布局使用
     * 配置文件格式【二维数组】
     * "_form":{
     *     "ui":[
     *         [
     *              {
     *              }
     *         ]
     *     ]
     * }
     */
    jsxFieldGrid,
    /**
     * Tab -> Grid布局使用
     * 配置文件格式【三维数组】
     * "_form":{
     *     "ui":[
     *         [
     *              [
     *                  {
     *                  }
     *              ]
     *         ]
     *     ]
     * }
     */
    jsxFieldGroup,
    // 渲染子表单专用，可根据Form的key渲染子表单，field且不一样
    jsxFieldPage,
    // 单个字段的渲染
    jsxField,
    // 单个按钮的渲染
    jsxOp,
    // 专用方法：高阶生成
    jsxOpArchor
}
