import React from 'react'
import Ux from 'ux'
import Rdr from './Rdr.Render';
import {Button, Col, Row} from 'antd';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .connect(state => Ux.dataIn(state)
        .rework({
            "status": ["submitting"]     // 防重复提交，连接检查专用
        })
        .to()
    )
    .cab("UI.Panel.Init").to()
)
class Component extends React.PureComponent {

    render() {
        const {$inited = [], $submitting} = this.props;
        const modelTable = $inited.filter(item => "MODEL" === item.type);
        const importConfig = Ux.fromHoc(this, "buttons")['IMPORT'];
        return (
            <div>
                <Row className={"ox-toolbar"}>
                    <Col span={2}/>
                    <Col span={22}>
                        <Button className={importConfig.className}
                                loading={$submitting._("loading")}
                                onClick={Op.bindImport(this)}>
                            {importConfig.text}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {Ux.auiTab(this)
                            .to(
                                Rdr.renderModel(this, modelTable, "model"),
                                <div>接口</div>
                            )}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component