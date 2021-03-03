import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Button, Col, Radio, Row, Spin} from 'antd';
import '../Cab.less';
import renderRadio from './UI.Step2.Radio';
import renderCircle from './UI.Step2.Circle';

import Op from './Op.Step2';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Step2")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiStep2(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 配置处理
             */
            const config = Ux.fromHoc(this, "config");
            const {$inited = {}, $submitting = false} = this.state;
            return (
                <div className={"form-duration"}>
                    <Spin spinning={$submitting}>
                        <Row>
                            <Col span={24} className={"title"}>
                                {config.title}：
                            </Col>
                        </Row>
                        <Row>
                            <Col span={23} offset={1}>
                                <Radio.Group style={{
                                    width: "100%"
                                }} onChange={Op.rxRadio(this)} value={$inited.runMode}>
                                    {config.up ? (config.up.map(item => {
                                        return (
                                            <Row key={item.key} className={"row-radio"}>
                                                <Col span={8}>
                                                    <Radio key={item.key} value={item.key}/>
                                                    &nbsp;
                                                    {item.label}
                                                </Col>
                                                <Col span={15} offset={1}>
                                                    {renderRadio(this, item)}
                                                </Col>
                                            </Row>
                                        )
                                    })) : false}
                                </Radio.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className={"title"}>
                                {config.title}：
                            </Col>
                        </Row>
                        <Row>
                            {renderCircle(this, config)}
                            <Button id={"$opSave"} className={"ux-hidden"}
                                    onClick={Op.rxSubmit(this)}/>
                        </Row>
                    </Spin>
                </div>
            )
        }, Ex.parserOfColor("PxImportStep2").page());
    }
}

export default Component