import React from 'react';
import Ux from "ux";
import Op from './op/Op.Event'; // UNLOCK
import Ex from "ex";
import {Button, Col, Input, Row, Table} from 'antd';
// UNLOCK
const componentInit = (reference) => {
    const state = {};

    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.className = "ux_table";
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.pagination = {
        pageSize: 8,
        size: "small"
    }
    $table.rowSelection = {
        type: "radio",
        onChange: Op.rxSelect(reference)
    }
    state.$table = $table;

    const search = Ux.fromHoc(reference, "search");
    state.$search = Ux.clone(search);
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
}

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Perm.Select")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
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
                    <Button className={"ux_hidden"}
                            id={"$opSelect"}
                            onClick={Op.rxConfirm(this)}/>
                </div>
            )
        }, Ex.parserOfColor("PxWizardSelect").control())
    }
}

export default Component