import React from 'react';
import {uca} from "zi";
import Rdr from './Web';
import __Zn from '../zero.uca.dependency';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "FileBatch";
// =====================================================
// componentInit/componentUp
// =====================================================
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        fileList: [],
        $listType: __Zn.Env.TYPE_UPLOAD.TEXT,
        $counter: 0
    }
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        const {ajax = {}} = this.props;
        __Zn.xtUploadInit(this, ajax, (fileList) => {
            __Zn.of(this).in({
                handler: __Zn.xtUploadHandler(this, {single: false}), // 构造的Handler
                fileList, // 已上传文件内容
                $counter: fileList.length // 已上传文件数量
            }).done();
            // this.?etState({
            //     handler: __Zn.xtUploadHandler(this, {single: false}), // 构造的Handler
            //     fileList, // 已上传文件内容
            //     $counter: fileList.length // 已上传文件数量
            // })
        })
    }

    render() {
        const {className = ""} = this.props;
        const attrInput = Sk.mixUca(UCA_NAME, null, {className});
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField {...attrInput}>
                {Rdr.renderBar(this)}
                {Rdr.renderFile(this)}
            </WebField>
        );
    }
}

export default Component