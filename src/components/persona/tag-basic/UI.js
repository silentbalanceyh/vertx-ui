import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';
import {Button, Col, Row, Table} from 'antd';
import Jsx from './Web.Search';

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
            const {
                $table = {}, $data = {}, $extra = [],
                $submitting = false
            } = this.state;
            let tableConfig = Ux.clone($table);
            tableConfig = Op.yoPagination(tableConfig, this);
            const {list = []} = $data;
            return (
                <div className={"ops-tag ops-table-op"}>
                    <Row className={"row-op"}>
                        <Col span={5}>
                            {Jsx.searchInput(this)}
                        </Col>
                        <Col span={9} className={"op-link"}>
                            {Jsx.searchLink(this)}
                        </Col>
                        <Col offset={6} span={4} className={"op-extra"}>
                            {$extra.map(item => {
                                const {text, ...rest} = item;
                                return (
                                    <Button {...rest}>{text}</Button>
                                )
                            })}
                        </Col>
                    </Row>
                    {Jsx.searchForm(this)}
                    <Row>
                        <Col span={24} className={"row-table"}>
                            <Table {...tableConfig} dataSource={list}
                                   loading={$submitting}
                                   rowClassName={(record, index) =>
                                       0 === index % 2 ? "" : "ops-row-black"}/>
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxTagBasic").page());
    }
}

export default Component