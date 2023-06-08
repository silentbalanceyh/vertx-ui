import __Zn from './zero.module.dependency';
import UcaField from './variant-uca';
import {Form} from "antd";
import React from "react";

const aiFormField = (reference, fieldConfig = {}, fnJsx) => {
    // const {form} = reference.props;
    if (fieldConfig) {
        let fnRender;
        if (__Zn.isFunction(fnJsx)) {
            fnRender = fnJsx;
        } else {
            if (fieldConfig.render) {
                fnRender = UcaField[fieldConfig.render];
            } else {
                fnRender = UcaField.aiInput;
            }
        }
        const {
            optionItem,
            // optionConfig,
            optionJsx,
            // field,
        } = fieldConfig;
        return (
            <Form.Item {...optionItem}>
                {fnRender(reference, optionJsx)}
            </Form.Item>
        )
        // const {?etFieldDecorator} = form;
        // return (
        //     <Form.Item {...optionItem}>
        //         {?etFieldDecorator(field, optionConfig)(fnRender(reference, optionJsx))}
        //     </Form.Item>
        // )
    } else {
        return false;
    }
}
export default {
    aiFormField,
}