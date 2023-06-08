import React from 'react';
import {uca} from "zi";
import Rdr from './Web';
import __Zn from '../zero.uca.dependency';

// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "FileUpload";
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        fileList: [],
        $counter: 0
    }
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        const {ajax = {}} = this.props;
        __Zn.xtUploadInit(this, ajax, (fileList) => {

            __Zn.of(this).in({
                handler: __Zn.xtUploadHandler(this), // 构造的Handler
                fileList, // 已上传文件内容
                $counter: fileList.length // 已上传文件数量
            }).done();
            // this.?etState({
            //     handler: __Zn.xtUploadHandler(this), // 构造的Handler
            //     fileList, // 已上传文件内容
            //     $counter: fileList.length // 已上传文件数量
            // })
        })
    }

    render() {
        const {readOnly = false} = this.props;
        const isSingle = !readOnly;
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField className={`web-file-upload ${isSingle ? "web-file-upload-single" : ""}`}>
                {Rdr.renderFile(this)}
                {Rdr.renderPreview(this)}
            </WebField>
        );
    }
}

export default Component;