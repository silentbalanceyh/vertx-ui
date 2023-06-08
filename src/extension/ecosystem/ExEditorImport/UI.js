import React from 'react';
import Ex from 'ex';
import Op from './Op';
import Ux from 'ux';
import {Button, Col, Row, Upload} from "antd";
import {LoadingAlert} from "web";

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExEditorImport";
/**
 * ## 「组件」`ExEditorImport`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |-------------------------------|
 * |         |------------|        |
 * |         |    File    |        |
 * |         |------------|        |
 * |                               |
 * |          Save  Cancel         |
 * |-------------------------------|
 * ```
 *
 * @memberOf module:uca/extension
 * @method *ExEditorImport
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const $combine = Ex.yiCombine(reference, config);
    const state = {};
    state.$combine = $combine;
    /*
     * notice 专用
     */
    const {notice = {}, upload = {}, button = ""} = $combine;
    state.$notice = Ux.clone(notice);
    /*
     * 上传配置处理
     */
    state.$upload = {
        control: {
            listType: "picture-card",
            accept: ".xls,.xlsx",   // Excel
            beforeUpload: Op.rxBeforeUpload(reference),    // 禁用
            onChange: Op.rxChange(reference),
            onRemove: Op.rxRemove(reference),
            // customRequest: Op.rxCustomRequest(reference)
        },
        imageAlt: "Template File",
        textClass: "ant-upload-text",
        text: upload
    };
    /*
     * 按钮配置
     */
    if ("string" === typeof button) {
        const $button = {};
        $button.id = button;
        $button.className = "ux_hidden";
        $button.onClick = Op.rxImport(reference);
        state.$button = $button;
    }
    Ux.of(reference).in(state).ready().done();
    //state.$ready = true;
    //this.?etState(state);
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: false,
        $fileList: []
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $notice = {}, $upload = {}, $image,
                $button = {},
                $loading = false,
                $fileList = []
            } = this.state;
            /*
             * 是否在加载，以及更改过的 $image 图片路径
             */
            $upload.loading = !!$loading;
            $upload.image = $image;
            $button.loading = $loading;
            const attrEditor = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrEditor}>
                    <Row>
                        <Col span={24}>
                            <LoadingAlert $alert={$notice}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"editor_content"}>
                            <Upload {...$upload.control} fileList={$fileList}>
                                {0 === $fileList.length ? (
                                    <div>
                                        {Ux.v4Icon($upload.loading ? 'loading' : 'plus')}
                                        <div className={$upload.textClass}>{$upload.text}</div>
                                    </div>
                                ) : false}
                            </Upload>
                            <div className={"button"}>
                                <Button {...$button}/>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).private());
    }
}

export default Component;