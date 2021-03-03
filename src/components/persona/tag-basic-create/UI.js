import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {Card, Col, Form, Row} from 'antd';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const page = Ux.fromHoc(this, "page");
            const {$heightStyle = {}} = this.state;
            const {style = {}} = $heightStyle;
            const $style = Ux.clone(style);
            $style.height = $style.maxHeight;
            return (
                <div className={"ops-tag"}>
                    <form>
                        <Row>
                            <Col span={24}>
                                <Card className={"ops-card-form"} title={
                                    <span className={"ops-title"}>{page.basic}</span>
                                }>
                                    <Row>
                                        <Col span={6}>
                                            {Op.renderInput(this, "tagName")}
                                        </Col>
                                        <Col span={6}>
                                            {Op.renderSelect(this, "type")}
                                        </Col>
                                        <Col span={6}>
                                            {Op.renderSelect(this, "dataModel")}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={11}>
                                <Card className={"ops-card-form"} title={
                                    <span className={"ops-title"}>{page.attribute}</span>
                                }>
                                    <div style={$style} className={"ops-component"}>
                                        {Op.renderAttr(this)}
                                    </div>
                                </Card>
                            </Col>
                            <Col span={2}>
                                <div style={{
                                    ...$style,
                                }} className={"ops-connector"}>
                                    {Op.renderConnector(this, {
                                        ...$style,
                                        paddingTop: ($style.height / 2)
                                    })}
                                </div>
                            </Col>
                            <Col span={11}>
                                <Card className={"ops-card-form"} title={
                                    <span className={"ops-title"}>{page.action}</span>
                                }>
                                    <div style={$style} className={"ops-component"}>
                                        {Op.renderAction(this)}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            {Op.renderSubmit(this)}
                        </Row>
                    </form>
                </div>
            )
        }, Ex.parserOfColor("PxTagBasicCreate").page());
    }
}

export default Form.create({})(Component)