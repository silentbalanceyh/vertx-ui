import React from 'react';
import Ux from "ux";
import {Table} from 'antd';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {data = [], $executor} = this.props;
        const table = Ux.fromHoc(this, "table");
        const attrs = Ux.configTable(this, table, $executor);
        return (
            <Table {...attrs} dataSource={data}/>
        )
    }
}

export default Component