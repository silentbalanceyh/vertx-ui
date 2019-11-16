import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {Card, Col, Input, List, Row, Table} from 'antd';
import './Cab.less';
import Ux from 'ux';

import renderItem from './UI.Item';

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $search = {}, $table = {},
                $list = {}, $submit = {},
                /* 数据、加载 */
                $loading = false, $selected = []
            } = this.state;
            const dataSource = Op.yoData(this);
            Ux.configScroll($table, dataSource, this);
            return (
                <div className={"ex-regiment"}>
                    <Row className={"row-search"}>
                        <Col span={5}>
                            <Input.Search {...$search}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={7} className={"row-left"}>
                            <Card title={$list.title} size={"small"}>
                                <List dataSource={$selected} className={"row-selected"}
                                      renderItem={renderItem(this, $list)}/>
                            </Card>
                        </Col>
                        <Col span={17}>
                            <Table {...$table} loading={$loading}
                                   dataSource={dataSource}/>
                        </Col>
                    </Row>
                    {Ux.aiButton(this, $submit)}
                </div>
            );
        }, Ex.parserOfColor("ExRegiment").component())
    }
}

export default Component;