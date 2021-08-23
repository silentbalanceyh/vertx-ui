import React from 'react';
import Ex from 'ex';
import Op from './Op';
import Ux from 'ux';
import {Button, Col, Icon, Row, Upload} from "antd";
import {LoadingAlert} from "web";

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
 * @memberOf module:web-component
 * @method *ExEditorImport
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const $combine = Ex.yiCombine(reference, config);
    const state = {};
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
        $button.className = "ux-hidden";
        $button.onClick = Op.rxImport(reference);
        state.$button = $button;
    }
    state.$ready = true;
    reference.setState(state);
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExEditorImport")
    .to()
)
class Component extends React.PureComponent {
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
            return (
                <div>
                    <Row>
                        <Col span={24}>
                            <LoadingAlert $alert={$notice}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"ex-editor-center"}>
                            <Upload {...$upload.control} fileList={$fileList}>
                                {0 === $fileList.length ? (
                                    <div>
                                        <Icon type={$upload.loading ? 'loading' : 'plus'}/>
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
            ;
        }, Ex.parserOfColor("ExEditorImport").private());
    }
}

export default Component;