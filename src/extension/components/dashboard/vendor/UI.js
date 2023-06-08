import React from 'react';
import Ux from "ux";
import Sk from "skin";
import __ from "./Cab.module.scss";
import Ex from "ex";
import {ProCard, StatisticCard} from "@ant-design/pro-components";
import UiList from './UI.List';

import vendor from './images/vendor.png';
import user from './images/user.png';

const APP_ICON = {
    vendor,
    user
}

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
    const config = Ux.inConfig(reference);
    const {report = {}} = config;
    return (
        <div className={"vendor_data"}>
            <ProCard title={config.title}>
                <StatisticCard.Group direction={"row"}>
                    {Object.keys(report).map(itemKey => {
                        const img = APP_ICON[itemKey];
                        const attrs = {};
                        if (img) {
                            attrs.chart = (<img src={img} alt={report[itemKey].title}/>);
                            attrs.chartPlacement = "left";
                        }
                        return (
                            <StatisticCard key={itemKey} statistic={{
                                title: report[itemKey].title,
                                value: 0,
                                description: report[itemKey].description,
                            }} {...attrs}/>
                        )
                    })}
                </StatisticCard.Group>
            </ProCard>
        </div>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const attrPage = Sk.mix(__.upg_dashboard_vendor);
        const inherit = Ex.yoAmbient(this);
        return (
            <div {...attrPage}>
                {renderApp(this)}
                {renderReport(this)}
                <UiList {...inherit}/>
            </div>
        )
    }
}

export default Component