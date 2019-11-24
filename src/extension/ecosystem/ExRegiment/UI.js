import React from 'react';
import Ex from 'ex';
import Op from './Op';
import Event from './event';
import {Col, Icon, Input, Row, Table, Tag} from 'antd';
import './Cab.less';
import Ux from 'ux';
import ExArbor from '../ExArbor/UI';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExRegiment")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {
            props: prevProps,
            state: prevState
        })
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                /* 选择后的操作 */
                $submit = {},
                /* 数据、加载 */
                $loading = false,
                /* 左边树，搜索框，表格 */
                $category = {}, $search = {}, $table = {},
                /* 选中项 */
                $divider = {}, $tabulation = {},
                /* 和category 相关的选中 */
                $clean
            } = this.state;
            const dataSource = Event.yoUnSelected(this);
            const selectedSource = Event.yoSelected(this);
            Ux.configScroll($table, dataSource, this);
            /*
             * 选择列表和清单
             */
            return (
                <div className={"ex-regiment"}>
                    <Row>
                        <Col span={4}>
                            <div className={"row-search"}>
                                <Input.Search {...$search}/>
                            </div>
                        </Col>
                        <Col span={20} className={"row-tag"}>
                            {$clean ? (
                                <Tag color={"volcano"} closable
                                     visible={!Ux.isEmpty($clean)} className={"tag"}
                                     onClose={Event.onClean(this, $clean.query)}>
                                    {$clean.label}
                                </Tag>
                            ) : false}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4}>
                            <div className={"row-left"}>
                                <ExArbor {...$category}/>
                            </div>
                        </Col>
                        <Col span={20}>
                            <Table {...$table} loading={$loading}
                                   dataSource={dataSource}/>
                            <div className={"row-divider"}>
                                <Tag color={$divider.color} className={"tag"}>
                                    <Icon type={"caret-down"}/>&nbsp;
                                    {$divider.text}
                                </Tag>
                            </div>
                            <Table {...$tabulation}
                                   dataSource={selectedSource}/>
                        </Col>
                    </Row>
                    {Ux.aiButton(this, $submit)}
                </div>
            );
        }, Ex.parserOfColor("ExRegiment").component())
    }
}

export default Component;