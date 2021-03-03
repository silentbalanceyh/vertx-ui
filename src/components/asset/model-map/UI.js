import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import Op from './Op';
import {Col, Row} from 'antd';
import {OpsGraphModel, OpsViewMMap} from 'app';

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.state;
            return (
                <div>
                    <Row>
                        <Col span={24}>
                            <OpsViewMMap $inited={$inited}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <OpsGraphModel $inited={$inited.graph}
                                           rxExtra={Op.rxExtra(this)}/>
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxModelMap").page());
    }
}

export default Component