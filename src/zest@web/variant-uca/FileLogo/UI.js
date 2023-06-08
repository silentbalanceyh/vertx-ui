import React from 'react';
import {uca} from "zi";
import Rdr from './Web';
import __Zn from '../zero.uca.dependency';
import Sk from 'skin';
import "./Cab.norm.scss";
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "FileLogo";
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
            const file = fileList[0];
            const state = {
                handler: __Zn.xtUploadHandler(this, {
                    // 单文件覆盖
                    overwrite: true,
                }), // 构造的Handler
                fileList, // 已上传文件内容
                $counter: fileList.length // 已上传文件数量
            }
            if (file && file.thumbUrl) {
                state.$imageUrl = file.thumbUrl;
            }
            __Zn.of(this).in(state).done();
            // this.?etState(state);
        })
    }

    render() {
        const attrInput = Sk.mixUca(UCA_NAME);
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField {...attrInput}>
                {Rdr.renderFile(this)}
                {Rdr.renderPreview(this)}
            </WebField>
        );
    }
}

export default Component;