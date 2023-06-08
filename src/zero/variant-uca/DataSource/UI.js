import React from 'react';
import {Col, Row, Table} from 'antd';

import Op from './Op';
import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

import renderRadio from './Web.Selection';
import {LoadingAlert} from 'zone';

import AssistForm from './Form.Assist';
import TabularForm from './Form.Tabular';
import CategoryForm from './Form.Category';

@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
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
                                    const alert = __Zn.fromHoc(this, "alert");
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