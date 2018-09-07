import React from 'react'
import {_zero} from "../../../_internal";
import Ux from "ux";
import {Table} from "antd";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    "state": {}
})
class Component extends React.PureComponent {
    componentDidMount() {
        const table = Ux.fromHoc(this, "table");
        this.setState({table});
    }

    render() {
        const {table = {}} = this.state;
        if (table) {
            const user = Ux.isLogged();
            const data = Ux.D.datumPure(user);
            if (table.columns) {
                Ux.D.renderColumn(table.columns);
            }
            return (
                <Table {...table} dataSource={data}/>
            )
        } else return false;
    }
}

export default Component