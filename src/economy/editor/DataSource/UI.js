import React from 'react';
import {component} from "../../_internal";
import Ux from 'ux';
import {Col, Row, Table} from 'antd';
import './Cab.less';
import Op from './op';

import renderRadio from './Web.Selection';
import AssistForm from './forms/Web.Assist';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$table = {}, $data = [], $inited = {}} = this.state;
            return (
                <div className={"web-data-source"}>
                    {renderRadio(this)}
                    <Row>
                        <Col span={24}>
                            {(() => {
                                const {$checked} = this.state;
                                if ("ASSIST" === $checked) {
                                    const {rxSource} = this.props;
                                    return (
                                        <AssistForm reference={this}
                                                    rxSource={rxSource}
                                                    $inited={$inited}/>
                                    )
                                } else {
                                    return false;
                                }
                            })()}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table {...$table} dataSource={$data}/>
                        </Col>
                    </Row>
                </div>
            )
        })
    }
}

export default Component