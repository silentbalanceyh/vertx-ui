import React from 'react';
import Op from "./Op";
import {Col, Input, Row, Table, Tree} from "antd";
import {Dialog, uca} from "zi";

import __Zn from "../zero.uca.dependency.table.UNLOCK";
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "UserSelector";
const renderTips = (reference) => {
    const {$config = {}} = reference.state;
    const {marker = {}} = $config;
    return (
        <Row className={"user-tips"}>
            {["DEPT", "TEAM", "GROUP"].map(item => {
                const icon = marker[item];
                if (icon) {
                    const $icon = __Zn.configIcon(icon);
                    return (
                        <Col span={3} key={item}>
                            {__Zn.v4Icon($icon)}
                            &nbsp;&nbsp;
                            {icon.tips}
                        </Col>
                    );
                } else return false;
            })}
        </Row>
    );
}

/*
 * 筛选用户专用窗口
 * 1. 消息可替换
 * 2. 接口固定以及统一，以 Extension 部分为主
 * 3. 列固定统一
 * 4. 搜索固定且统一
 * 5. 支持左侧树形结构
 */
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Op.componentInit(this);
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        const {$config = {}} = this.state;
        __Zn.xtLazyUp(this, {props: prevProps, state: prevState}, {
            config: $config
        });
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {reference, ...jsx} = this.props;
            const {$data = {}, $tableKey, $config = {}} = this.state;
            const {
                onClick,
                dialog,
                table = {},
                search,             // 弹窗搜索
                tree = []           // 树型菜单
            } = this.state ? this.state : {};
            jsx.onClick = onClick;
            /*
             * 分页计算
             */
            const pageAndChange = Op.yoPager(this, $config);

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
            const attrTable = {
                key: $tableKey ? $tableKey : __Zn.randomString(16),
                loading: this.state['$loading'],
                ...$config.table,
                ...$table,
                ...pageAndChange,
                bordered: false,
                className: "ux_table",
            };
            const attrs = Sk.mixUca(UCA_NAME, null, {
                className: jsx.className
            });
            dialog.top = 56;
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...attrs}>
                    <Input {...inputCombine}/>
                    <Dialog className={`${attrs.className}_Dialog`}
                            size={"small"}
                            $visible={this.state['$visible']}   // 窗口是否开启
                            $dialog={dialog}>
                        <Row>
                            <Col span={4}>
                                <Input.Search {...search} enterButton/>
                                <Tree {...tree}/>
                            </Col>
                            <Col span={20} className={"user-content"}>
                                {renderTips(this)}
                                <Table {...attrTable}
                                       dataSource={dataSource}/>
                            </Col>
                        </Row>
                    </Dialog>
                </WebField>
            );
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component