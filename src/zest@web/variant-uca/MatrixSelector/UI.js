import React from 'react';
import Op from './Op';
import {Col, Input, Row, Table} from "antd";
import {Dialog} from "zi";

import __Zn from "../zero.uca.dependency.table.UNLOCK";
import Sk from 'skin';
import "./Cab.norm.scss";
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "MatrixSelector";
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    constructor(props) {
        super(props);
        this.state = Op.yiDefault(this);
    }

    componentDidMount() {
        /*
         * Lazy Init
         */
        __Zn.xtLazyInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        __Zn.xtLazyUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const {config = {}, value = []} = this.props;
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
        const ref = __Zn.onReference(this, 1);

        let $table = __Zn.clone(table);
        $table.columns = __Zn.configColumn(this, $table.columns);
        $table = Op.yoSelected(this, $table);

        const dataSource = __Zn.valueArray($data);

        __Zn.configScroll($table, dataSource, ref);
        /*
         * 处理输入框属性
         */
        const $tableTarget = Op.yoTarget(this, table);
        __Zn.configScroll($tableTarget, value, ref);
        const attrUca = Sk.mixUca(UCA_NAME,
            () => $tableTarget.style ? $tableTarget.style : {}, {
                _className: "ux_table"
            })
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField>
                {__Zn.aiErrorInput(this, !$visible)}
                <Table {...$tableTarget} {...attrUca}
                       dataSource={value}/>
                <Dialog className="ux_dialog"
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
    }
}


export default Component;