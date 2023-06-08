import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';

import __Zn from '../zero.uca.dependency';
const UCA_NAME = "JsonEditor";
// =====================================================
// componentInit/componentUp
// =====================================================
// =====================================================
// 事件处理
// =====================================================
const rxChange = (reference) => (content) => {
    const {onChange} = reference.props;
    if (__Zn.isFunction(onChange)) {
        const body = content.jsObject;
        if (body) {
            onChange(body);
        }
    }
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {value = {}, height = 240} = this.props;
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField {...this.props}>
                <JSONInput id={"content"} locale={locale}
                           height={height}
                           onChange={rxChange(this)}
                           placeholder={value}
                           waitAfterKeyPress={1000}
                           theme={"light_mitsuketa_tribute"}
                           width={"100%"}/>
            </WebField>
        );
    }
}

export default Component;