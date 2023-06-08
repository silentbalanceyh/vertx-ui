import React from 'react';
import {Col, Input, Row, Table} from "antd";
import Op from './Op';
import {Dialog} from 'zi'; // 直接读取 Dialog 专用
import __Zn from "../zero.uca.dependency.table.UNLOCK";
import Sk from 'skin';
import "./Cab.norm.scss";
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ListSelector";
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    constructor(props) {
        super(props);
        this.state = Op.yiDefault(this);
    }

    componentDidMount() {
        __Zn.xtLazyInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        __Zn.xtLazyUp(this, {props: prevProps, state: prevState});
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {config = {}, reference, ...jsx} = this.props;
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

            let $table = __Zn.clone(table);
            $table.columns = __Zn.configColumn(this, $table.columns);
            $table = Op.yoSelected(this, $table);

            const dataSource = __Zn.valueArray($data);

            __Zn.configScroll($table, dataSource, reference);
            /*
             * 处理输入框属性
             */
            const inputCombine = Op.yoCombine(this, inputAttrs);

            const attrs = Sk.mixUca(UCA_NAME, null, {
                className: jsx.className
            });
            // Selector要更小
            dialog.top = 72;
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...attrs}>
                    <Input {...inputCombine}/>
                    <Dialog className={`${attrs.className}_Dialog`}
                            size={"small"}
                            $visible={this.state['$visible']}   // 窗口是否开启
                            $dialog={dialog}>
                        {search ? (
                            <Row style={{
                                marginBottom: 8
                            }}>
                                <Col span={9}>
                                    <Input.Search {...search} enterButton/>
                                </Col>
                            </Row>
                        ) : false}
                        <Row>
                            <Col span={24}>
                                <Table key={$tableKey ? $tableKey : __Zn.randomString(16)}
                                       loading={this.state['$loading']}
                                       {...config.table} // 原始配置信息
                                       {...$table} // 处理过的表格信息
                                       {...pageAndChange} // 处理分页处理
                                       bordered={false}
                                       className={"ux_table"}
                                       dataSource={dataSource}/>
                            </Col>
                        </Row>
                    </Dialog>
                </WebField>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component;
