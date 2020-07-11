import React from 'react';
import Ux from "ux";
import Op from './Op';
import Ex from "ex";
import {Button, Col, Input, Row, Table} from 'antd';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Perm.Select")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiSelect(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$search = {}, $data = [], $table, $selected} = this.state;
            $table.rowSelection.selectedKeys = $selected ? [$selected.key] : []
            return (
                <div>
                    <Row>
                        <Col span={6}>
                            <Input.Search {...$search}
                                          onSearch={Op.rxSearch(this)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table {...$table} dataSource={$data}/>
                        </Col>
                    </Row>
                    <Button className={"ux-hidden"}
                            id={"$opSelect"}
                            onClick={Op.rxConfirm(this)}/>
                </div>
            )
        }, Ex.parserOfColor("PxWizardSelect").control())
    }
}

export default Component