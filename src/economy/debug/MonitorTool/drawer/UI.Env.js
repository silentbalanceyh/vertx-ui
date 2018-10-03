import React from 'react';
import Ux from 'ux';
import {Table} from 'antd';
import {_zero} from "../../../_internal";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Env",
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
            const data = Ux.D.datumEnv(this);
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