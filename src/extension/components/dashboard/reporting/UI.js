import React from 'react';
import Ux from 'ux';

import {ProCard, StatisticCard} from "@ant-design/pro-components";
import Sk from "skin";
import __ from "./Cab.module.scss";
import Ex from "ex";

const renderContent = (reference) => {
    const config = Ux.inHoc(reference, "content");
    const {$menus} = reference.props;
    const menuItem = Ex.a4MenuDash($menus, reference, Ux.Env.MENU_TYPE.NAV);
    return (
        <ProCard ghost gutter={8} className={"report_container"}>
            {menuItem.map(data => {
                return (
                    <ProCard layout="center" key={data.key}
                             bordered className={"report_card"}>
                        <StatisticCard className={"report_card_statistic"} statistic={{
                            value: data.text,
                            description: config[data.name]
                        }} chart={data.icon} chartPlacement={"left"} onClick={event => {
                            Ux.prevent(event);
                            const {$router} = reference.props;
                            Ux.toRoute(reference, data.uri, {target: $router.path()})
                        }}/>
                    </ProCard>
                )
            })}
        </ProCard>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiAssist(this).then(Ux.ready).then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const attrPage = Sk.mix(__.upg_dashboard_reporting);
            return (
                <div {...attrPage}>
                    {renderContent(this)}
                    {/*{renderCatalog(this)}*/}
                </div>
            )
        }, Ex.parserOfColor("PxReporting").page());
    }
}

export default Component