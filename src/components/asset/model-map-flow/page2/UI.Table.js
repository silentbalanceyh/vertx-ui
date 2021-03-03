import React from 'react';
import Ex from 'ex';
import Ux from "ux";
import {Popconfirm, Table} from 'antd';
import Empty from '../images/Empty.png';

const yiInternal = (reference) => {
    const state = {};
    state.$ready = true;
    const table = Ux.fromHoc(reference, "table");
    const info = Ux.fromHoc(reference, "info");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.columns.forEach(column => {
        if ("key" === column.dataIndex) {
            column.render = (text) => {
                return (
                    <Popconfirm title={info.confirm} onConfirm={event => {
                        Ux.prevent(event);
                        Ux.fn(reference).rxDelete({key: text, field: 'relations'});
                    }}>
                        <a href={"#"} onClick={event => {
                            Ux.prevent(event);
                        }}>
                            {info.delete}
                        </a>
                    </Popconfirm>
                )
            }
        }
    })
    $table.className = "ops-table";
    state.$table = $table;
    reference.setState(state);
}

const renderEmpty = (reference) => {
    const empty = Ux.fromHoc(reference, "empty");
    return (
        <div className={"empty-text"}>
            <div className={"row-image"}>
                <img src={Empty} alt={empty.title}/>
            </div>
            <div className={"row-comment"}>
                {empty.title}
            </div>
            <div className={"row-content"}>
                {empty.message}
            </div>
        </div>
    )
}

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Page2.Table")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$table = {}} = this.state;
            const {data = []} = this.props;
            if (8 < data.length) {
                $table.pagination = {
                    pageSize: 8,
                    size: "small"
                }
            } else {
                $table.pagination = false
            }
            return (
                <div className={"form-table"}>
                    <Table {...$table} dataSource={data} className={"web-table"}
                           locale={{
                               emptyText: renderEmpty(this)
                           }}
                           rowClassName={(record, index) =>
                               0 === index % 2 ? "" : "ops-row-black"}/>
                </div>
            )
        }, Ex.parserOfColor("PxPhase2Table").control())
    }
}

export default Component