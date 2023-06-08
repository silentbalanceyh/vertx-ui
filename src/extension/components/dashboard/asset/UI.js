import React from 'react';
import Sk from "skin";
import __ from "./Cab.module.scss";
import Ux from "ux";
import {ProCard, StatisticCard} from "@ant-design/pro-components";

import {Badge, Col, Row, Space} from "antd";
import Ex from "ex";

const renderApp = (reference) => {
    const config = Ux.inConfig(reference);
    const {$menus} = reference.props;
    const menuItem = Ex.a4MenuDash($menus, reference, Ux.Env.MENU_TYPE.NAV);
    return (
        <ProCard title={config.title}
                 direction={"row"} className={"asset_app"}>
            {menuItem.map(item => {
                return (
                    <ProCard colSpan={3} className={"link"} key={item.key}>
                        <a href={""} onClick={event => {
                            Ux.prevent(event);
                            const {$router} = reference.props;
                            Ux.toRoute(reference, item.uri, {target: $router.path()})
                        }}>
                            {item.icon}
                            <label>{item.text}</label>
                        </a>
                    </ProCard>
                )
            })}
        </ProCard>
    )
}

const renderReport = (reference) => {
    const config = Ux.inHoc(reference, "report");
    const {items = []} = config;
    return (
        <ProCard title={config.title}
                 split={"horizontal"} className={"asset_app"}>
            {items.map((row, rIdx) => {
                return (
                    <ProCard split={"vertical"} className={"asset_app_row"} key={`row${rIdx}`}>
                        {row.map(item => {
                            return (
                                <StatisticCard key={item.key} statistic={{
                                    title: item.title,
                                    value: 0,
                                    description: item.description,
                                }}/>
                            )
                        })}
                    </ProCard>
                )
            })}
        </ProCard>
    )
}
const renderLink = (reference) => {
    const {$menus} = reference.props;
    const menuItem = Ex.a4MenuDash($menus, reference, Ux.Env.MENU_TYPE.REPO);
    return (
        <ProCard className={"asset_app_space"}>
            <Space direction={"vertical"}>
                {menuItem.map(item => {
                    return (
                        <Badge.Ribbon key={item.key} text={item.text}>
                            <a href={""} className={"link_repo"} onClick={event => {
                                Ux.prevent(event);
                                const {$router} = reference.props;
                                Ux.toRoute(reference, item.uri, {target: $router.path()})
                            }}>
                                {item.icon}
                            </a>
                        </Badge.Ribbon>
                    )
                })}
            </Space>
        </ProCard>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const attrPage = Sk.mix(__.upg_dashboard_asset);
        return (
            <div {...attrPage}>
                {renderApp(this)}
                <Row>
                    <Col span={20} className={"report_container"}>
                        {renderReport(this)}
                    </Col>
                    <Col span={4}>
                        {renderLink(this)}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component