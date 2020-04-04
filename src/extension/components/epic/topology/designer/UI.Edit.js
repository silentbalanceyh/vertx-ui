import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Col, Row} from 'antd';
import Op from './op';

import renderGraphic from './Web.Graphic';
import renderTool from './Web.Tool';

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Edit")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.onInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return (
                <div className={"drawer-background"}>
                    <Row style={{
                        marginBottom: 3
                    }}>
                        <Col span={24}>
                            {renderTool(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {renderGraphic(this)}
                        </Col>
                    </Row>
                </div>
            );
        }, Ex.parserOfColor("FormEdit").form());
    }
}

export default Component;