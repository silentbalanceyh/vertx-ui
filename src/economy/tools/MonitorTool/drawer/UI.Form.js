import React from 'react';
import {_zero} from "../../../_internal";
import {DataLabor} from 'entity';
import Ux from "ux";
import {Table} from "antd";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "debug.active": ["form"]
            })
            .rinit(["form"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const table = Ux.fromHoc(this, "table");
        this.setState({table});
    }

    render() {
        const {table = {}} = this.state;
        const {$form} = this.props;
        if (table) {
            const data = $form.is() ?
                Ux.D.datumPure($form._("record")) : Ux.D.datumPure();
            if (table.columns) {
                Ux.D.renderColumn(table.columns);
            }
            return (
                <Table {...table} dataSource={data}/>
            );
        } else return false;
    }
}

export default Component;