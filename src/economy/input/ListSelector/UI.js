import React from 'react';
import Ux from 'ux';
import {Col, Input, Row, Table} from "antd";
import Op from './Op';

import {Dialog} from 'web'; // 直接读取 Dialog 专用

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Op.yiDefault(this);
    }

    componentDidMount() {
        /*
         * Lazy Init
         */
        Ux.xtLazyInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtLazyUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {$data = {}, $tableKey} = this.state;
        const {onClick, dialog, table = {}, search} = this.state ? this.state : {};
        jsx.onClick = onClick;
        /*
         * 分页计算
         */
        const pageAndChange = Op.yoPager(this, config);
        /*
         * 属性拉平处理
         * 表格处理
         */
        const inputAttrs = Op.yoValue(this, jsx);
        const ref = Ux.onReference(this, 1);

        let $table = Ux.clone(table);
        $table = Op.yoSelected(this, $table);

        Ux.configScroll($table, $data.list, ref);
        /*
         * 处理输入框属性
         */
        const inputCombine = Op.yoCombine(this, inputAttrs);
        return (
            <Input.Group>
                <Input {...inputCombine}/>
                <Dialog className="web-dialog"
                        size={"small"}
                        $visible={this.state['$visible']}   // 窗口是否开启
                        $dialog={dialog}>
                    {search ? (
                        <Row style={{
                            marginBottom: 8
                        }}>
                            <Col span={6}>
                                <Input.Search {...search}/>
                            </Col>
                        </Row>
                    ) : false}
                    <Row>
                        <Col span={24}>
                            <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                                   loading={this.state['$loading']}
                                   {...config.table} // 原始配置信息
                                   {...$table} // 处理过的表格信息
                                   {...pageAndChange} // 处理分页处理
                                   bordered={false}
                                   className={"web-table"}
                                   dataSource={$data.list}/>
                        </Col>
                    </Row>
                </Dialog>
            </Input.Group>
        );
    }
}

export default Component;
