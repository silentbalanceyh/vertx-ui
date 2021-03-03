import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import Op from './Op';
import {Card, Col, Input, Row, Table, Tag} from "antd";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiList(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const card = Ux.fromHoc(this, "card");
            return (
                <Card className={"ops-card-list"} title={
                    <span className={"ops-title"}>{card.text}</span>
                } extra={(() => {
                    const {$extra = {}} = this.state;
                    const {search = {}, filter} = $extra;
                    return (
                        <Row>
                            <Col span={19}>
                                <Input.Search placeholder={search.placeholder}
                                              enterButton={search.button}
                                              onSearch={Op.rxSearch(this)}/>
                            </Col>
                            <Col span={5}>
                                <a href={"ops-link"}>
                                    {filter}
                                </a>
                            </Col>
                        </Row>
                    );
                })()}>
                    {(() => {
                        const {$table, $keyword} = this.state;
                        const $tableConfig = Ux.clone($table);
                        const {data = []} = this.props;
                        // 过滤处理（搜索）
                        let $data = Ux.clone(data);
                        if ($keyword) {
                            $data = $data.filter(item => {
                                // 修复无 name 和 code 的问题
                                const name = item.name ? item.name : "";
                                const code = item.code ? item.code : "";
                                return (0 <= name.indexOf($keyword) ||
                                    0 <= code.indexOf($keyword))
                            })
                        }
                        // 分页处理
                        $tableConfig.pagination = {
                            size: "small",
                            pageSize: 8,
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
                            <Table {...$tableConfig} dataSource={$data}
                                   rowClassName={(record, index) =>
                                       0 === index % 2 ? "" : "ops-row-black"}/>
                        )
                    })()}
                </Card>
            )
        }, Ex.parserOfColor("OpsSourceList").define())
    }
}

export default Component