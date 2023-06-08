import React from 'react';
import Ux from "ux";
import {Table} from "antd";

const UCA_NAME = "FSettleItems";
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {data = []} = this.props;
        const table = Ux.fromHoc(this, "table");
        table.columns = Ux.configColumn(this, table.columns);
        let dataSource = Ux.clone(data);
        Ux.configScroll(table, dataSource, this);

        dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'))
        return (
            <Table {...table} dataSource={dataSource}/>
        )
    }
}

export default Component