import React from 'react';
import { Form } from 'antd';
import Opt from './Ux.Option'
import Dg from './Ux.Debug'
import Immutable from 'immutable';

const jsxField = (reference, item = {}, render) => {
    Dg.ensureRender(render, item);
    item = Immutable.fromJS(item).toJS();
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return (
        <Form.Item { ...Opt.optionFormItem(item.optionItem) }>
            { 0 <= item.field.indexOf("$") ? (
                render(reference, item.optionJsx)
            ) : (
                getFieldDecorator(item.field, item.optionConfig)(
                    render(reference, item.optionJsx)
                )) }
        </Form.Item>
    )
};

const jsxFieldRow = (reference, item = {}, render) => {
    Dg.ensureRender(render, item);
    item = Immutable.fromJS(item).toJS();
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    return (
        <Form.Item { ...item.optionItem }>
            { getFieldDecorator(item.field, item.optionConfig)(
                render(reference, item.optionJsx)) }
        </Form.Item>
    )
};
export default {
    // Field专用
    jsxField,
    // RowField专用
    jsxFieldRow,
}
