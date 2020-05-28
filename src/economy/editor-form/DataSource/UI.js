import React from 'react';
import {component} from "../../_internal";
import Ux from 'ux';
import {Col, Row, Table} from 'antd';
import './Cab.less';
import Op from './op';

import renderRadio from './Web.Selection';
import LoadingAlert from '../../loading/LoadingAlert/UI';

import AssistForm from './forms/Web.Assist';
import TabularForm from './forms/Web.Tabular';
import CategoryForm from './forms/Web.Category';

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
            const {$table = {}, $data = []} = this.state;
            return (
                <div className={"web-data-source"}>
                    {renderRadio(this)}
                    <Row>
                        <Col span={24} className={"data-form"}>
                            {(() => {
                                const {$checked} = this.state;
                                if ("ASSIST" === $checked) {
                                    const {rxApi} = this.props;
                                    const {$assist} = this.state;
                                    return (
                                        <AssistForm reference={this}
                                                    $inited={$assist}
                                                    rxSubmit={Op.onSubmit(this)}
                                                    rxSource={rxApi}/>
                                    )
                                } else if ("TABULAR" === $checked) {
                                    const {rxType} = this.props;
                                    return (
                                        <TabularForm reference={this}
                                                     $inited={Op.toInit($data, 'tabular')}
                                                     rxSubmit={Op.onSubmit(this)}
                                                     rxSource={rxType}/>
                                    )
                                } else if ("CATEGORY" === $checked) {
                                    const {rxType} = this.props;
                                    return (
                                        <CategoryForm reference={this}
                                                      $inited={Op.toInit($data, 'category')}
                                                      rxSubmit={Op.onSubmit(this)}
                                                      rxSource={rxType}/>
                                    )
                                } else {
                                    const alert = Ux.fromHoc(this, "alert");
                                    return (
                                        <LoadingAlert $alert={alert}/>
                                    );
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