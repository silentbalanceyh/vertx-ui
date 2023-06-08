import Ux from "ux";
import React from "react";
import Ex from "ex";
import Op from "./Op";
import {Table} from "antd";
import Col from "./Web.Column";

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.List.Trash")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        const state = {};
        Op.yiList(this, state, Col.renderActionTrash)
            .then(Ux.ready)
            .then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const {data = []} = this.props;
            const {$table = {}, $spinning} = this.state;
            const scroll = Ux.toHeightStyle(278);
            const table = Ux.clone($table);
            table.scroll = {
                y: scroll.minHeight,
                x: "max-content"
            };
            table.loading = $spinning;
            // 选中项
            Op.yoRowSelection(table, this, true);
            return (
                <Table {...table} dataSource={data}/>
            )
        }, Ex.parserOfColor("Document.Management.ListTrash").normalize());
    }
}

export default Component