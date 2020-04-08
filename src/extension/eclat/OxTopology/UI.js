import React from 'react';
import Yo from './yo';
import Ex from 'ex';
import Ux from 'ux';
import {Col, Row} from 'antd';
import renderOption from './Web.Option';
import renderWithTpl from './Web.Tpl';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExTopology")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yo.yiPage(this);
    }

    render() {
        return (
            <div className={"drawer-background"}>
                {renderOption(this)}
                <Row>
                    <Col span={24}>
                        {Ex.yoRender(this, () => renderWithTpl(this),
                            Ex.parserOfColor("OxTopology").component())}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Component;