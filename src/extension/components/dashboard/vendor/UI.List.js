import Ux from "ux";
import Ex from 'ex';
import {Button, Table} from "antd";
import React from 'react';
import {ProCard} from "@ant-design/pro-components";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        const {$app} = this.props;
        const sigma = $app._("sigma");
        Ux.ajaxPost("/api/up/flow-queue", {
            pager: {page: 1, size: 3},
            criteria: {flowDefinitionKey: "process.vendor.check-in", sigma},
            sorter: ["createdAt,DESC"]
        }).then(response => {
            const {list = []} = response;
            const state = {};
            state.$ready = true;
            state.$data = list;
            const table = Ux.inHoc(this, "table");
            table.columns = Ux.configColumn(this, table.columns);
            state.$config = table;
            Ux.of(this).in(state).done();
            // this.?etState(state);
        })
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$config = {}, $data = []} = this.state;
            const card = Ux.inHoc(this, "card");
            const extra = Ux.inHoc(this, "extra");
            return (
                <ProCard {...card} extra={<Button icon={Ux.v4Icon(extra.icon)} onClick={event => {
                    Ux.prevent(event);
                    const {$router} = this.props;
                    Ux.toRoute(this, extra.uri, {target: $router.path()})
                }}>{extra.text}</Button>}>
                    <Table {...$config} dataSource={$data}/>
                </ProCard>
            )
        }, Ex.parserOfColor("PxVendor").page())
    }
}

export default Component;