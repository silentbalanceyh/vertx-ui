import React from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';
import {Input} from 'antd';
import Op from './Op';

class Component extends React.PureComponent {

    render() {
        const {value = {}} = this.props;
        return (
            <Input.Group {...this.props}>
                <JSONInput id={"content"} locale={locale}
                           height={240}
                           onChange={Op.rxChange(this)}
                           placeholder={value}
                           waitAfterKeyPress={2000}
                           theme={"light_mitsuketa_tribute"}
                           width={"100%"}/>
            </Input.Group>
        );
    }
}

export default Component;