import U from 'underscore';
import E from '../../../error';
import React from 'react';
import {Form} from 'antd';
import Abs from '../../../abyss';

/**
 * Jsx单行字段的Render处理
 * @method jsxItem
 * @param reference React对应组件引用 React.PureComponent
 * @param item
 * @param render
 * @return {*}
 */
export default (reference, item = {}, render) => {
    E.fxTerminal(!U.isFunction(render), 10059, render, item);
    item = Abs.clone(item);
    // 包装 render
    let jsxRender = () => false;
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    if (0 <= item.field.indexOf("$")) {
        jsxRender = () => render(reference, item.optionJsx, item.optionConfig);
    } else {
        const jsx = item.optionJsx ? Abs.clone(item.optionJsx) : {};
        const config = item.optionConfig ? Abs.clone(item.optionConfig) : {};
        jsxRender = () => getFieldDecorator(item.field, config)(
            render(reference, jsx, config)
        );
    }
    if ("$button" === item.field) {
        if (item.optionItem) {
            item.optionItem.label = "";
            item.optionItem.colon = false;
            //item.optionItem.labelCol = {span: 0};
            //item.optionItem.wrapperCol = {span: 24};
        }
    }
    console.info(item);
    return item.optionItem ? (
        <Form.Item {...item.optionItem}>
            {jsxRender(item)}
        </Form.Item>
    ) : jsxRender(item);
};