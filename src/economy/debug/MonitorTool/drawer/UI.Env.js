import React from 'react'
import Ux from 'ux';
import {Table} from 'antd';
import {_zero} from "../../../_internal";

const getColumns = (reference) => {
    const table = Ux.fromHoc(reference, "table");
    return table;
};

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Env",
    "state": {}
})
class Component extends React.PureComponent {
    componentDidMount() {
        const table = getColumns(this);
        this.setState({table});
    }

    render() {
        const data = Ux.D.datumEnv(this);
        const {table = {}} = this.state;
        if (table) {
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