import React from 'react';
import Op from './Op';
import Ux from 'ux';
import {Col, Input, Row, Table} from "antd";
import {Dialog} from "web";
import './Cab.less';

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
        const {config = {}, value = [], ...jsx} = this.props;
        const {$data = {}, $tableKey, $visible = false} = this.state;
        const {dialog, table = {}, search} = this.state ? this.state : {};
        /*
         * 分页计算
         */
        const pageAndChange = Op.yoPager(this, config);
        /*
         * 属性拉平处理
         * 表格处理
         */
        const ref = Ux.onReference(this, 1);

        let $table = Ux.clone(table);
        $table = Op.yoSelected(this, $table);

        Ux.configScroll($table, $data.list, ref);
        /*
         * 处理输入框属性
         */
        const $tableTarget = Op.yoTarget(this, table);
        Ux.configScroll($tableTarget, value, ref);
        return (
            <Input.Group>
                {Ux.aiFloatError(this, !$visible)}
                <Table {...$tableTarget} className={"web-table web-matrixselector-table"}
                       dataSource={value}/>
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