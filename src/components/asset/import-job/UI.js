import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';
import {Button, Col, Row, Table} from 'antd';
import './Cab.less';
import renderDg from './Web.Dialog';

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
                <div className={"ops-task ops-table-op"}>
                    <Row className={"row-op"}>
                        <Col offset={22} span={2} className={"op-extra"}>
                            {$extra.map(item => {
                                const {text, ...rest} = item;
                                return (
                                    <Button {...rest}>{text}</Button>
                                )
                            })}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"row-table"}>
                            <Table {...tableConfig} dataSource={list}
                                   loading={$submitting}
                                   rowClassName={(record, index) =>
                                       0 === index % 2 ? "" : "ops-row-black"}/>
                            {renderDg(this)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxImportJob").page());
    }
}

export default Component