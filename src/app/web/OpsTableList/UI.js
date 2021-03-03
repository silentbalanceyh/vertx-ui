import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';
import {Card, Table, Tag} from "antd";
import Rdr from './page.column';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .state({$ready: false, $refresh: false})
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiInit(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuInit(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const card = Ux.fromHoc(this, "card");
            const {__dialog} = this.state;
            return (
                <Card className={"ops-card-list"} title={
                    <span className={"ops-title"}>{card.text}</span>
                }>
                    {__dialog.render()}
                    {(() => {
                        const {$table, $dataSource = [], $total, $query = {}} = this.state;
                        const $tableConfig = Ux.clone($table);

                        $tableConfig.columns = [Rdr.pageColumn(this)]
                            .concat(Ux.configColumn(this, $tableConfig.columns));

                        $tableConfig.onChange = (pagination = {}, sorter, filters = {}) => {
                            const pager = {
                                page: pagination.current,
                                size: pagination.pageSize,
                            }
                            Op.yData(this, {$query: {pager}});
                        }
                        $tableConfig.pagination = {
                            size: "small",
                            pageSize: $query.pager.size,
                            current: $query.pager.page ? $query.pager.page :1,
                            total: $total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            pageSizeOptions: [
                                "8", "16", "32", "64"
                            ],
                            showTotal: (total) => {
                                const {pagination = {}} = $table;
                                return (
                                    <Tag color={"magenta"} style={{fontSize: 14}}>
                                        {Ux.formatExpr(pagination.total, {total})}
                                    </Tag>
                                )
                            }
                        }
                        return (
                            <Table {...$tableConfig} dataSource={$dataSource}
                                   rowKey={$dataSource => $dataSource.id}
                                   rowClassName={(record, index) =>
                                       0 === index % 2 ? "" : "ops-row-black"}/>
                        )
                    })()}
                </Card>
            )
        }, Ex.parserOfColor("OpsTableList").define())
    }
}

export default Component;