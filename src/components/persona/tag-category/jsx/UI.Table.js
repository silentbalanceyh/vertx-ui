import React from 'react';
import Ux from "ux";
import Op from '../Op';
import {Col, Empty, Input, Row, Table} from 'antd';
import Ex from "ex";

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Table")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiTable(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuTable(this, {props: prevProps, state: prevState})
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $table = {}, $data = {},
                $submitting = false
            } = this.state;
            let tableConfig = Ux.clone($table);
            tableConfig = Op.yoPagination(tableConfig, this);
            const {list = []} = $data;

            const {data} = this.props;
            const empty = Ux.fromHoc(this, "empty");
            return (
                <div style={{
                    height: Ux.toHeight(295)
                }} className={"ops-tag-table"}>
                    <Row className={"cat-row"}>
                        <Col span={8}>
                            {(() => {
                                const search = Ux.fromHoc(this, "search");
                                const {$keyword} = this.state;
                                return (<Input.Search {...search.input} value={$keyword}
                                                      onChange={Op.rxSearch(this)}
                                                      onSearch={Op.rxSearchQuick(this)}/>)
                            })()}
                        </Col>
                    </Row>
                    <Row className={"cat-row"}>
                        <Col span={24} className={"row-table"}>
                            {Ux.isEmpty(data) ? (
                                <div className={"empty"}>
                                    <Empty description={empty.message}/>
                                </div>
                            ) : (
                                <Table {...tableConfig} dataSource={list}
                                       loading={$submitting}
                                       rowClassName={(record, index) =>
                                           0 === index % 2 ? "" : "ops-row-black"}/>
                            )}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxTagCategory").page());
    }
}

export default Component