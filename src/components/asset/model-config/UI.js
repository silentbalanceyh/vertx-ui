import React from 'react';
import Ux from "ux";
import {Col, Row, Spin} from 'antd';
import {Of, OpsModelTree, OpsViewMTable} from 'app';
import Ex from 'ex';
import {Dsl} from 'entity';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {$loading = false} = this.state;
        return (
            <Row>
                <Col span={5}>
                    <OpsModelTree {...Ex.yoAmbient(this)}
                                  rxTree={(record = {}) => {
                                      this.setState({$loading: true});
                                      Dsl.of(this).bind(Of.apiModelFull).ok($inited => {
                                          this.setState({$inited, $loading: false});
                                      }).async(record)
                                  }}/>
                </Col>
                <Col span={19} className={"ops-range"}>
                    <Spin spinning={$loading}>
                        {(() => {
                            const {$inited} = this.state;
                            return (
                                <OpsViewMTable {...Ex.yoAmbient(this)}
                                               $inited={$inited}/>
                            )
                        })()}
                    </Spin>
                </Col>
            </Row>
        );
    }
}

export default Component