import Ux from "ux";
import React from "react";
import {ProCard, StatisticCard} from "@ant-design/pro-components";

import Ex from "ex";

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const promises = [];
        promises.push(
            //项目
            Ux.ajaxPost("/api/project/search").then(response => {
                state.$project = Ux.valueArray(response);
            })
        )
        promises.push(
            //合同
            Ux.ajaxPost("/api/contract/search").then(response => {
                state.$contract = Ux.valueArray(response);
            })
        )
        return Ux.parallel(promises).then(result => {
            return Ux.promise(state);
        }).then(state => {
            state.contractCount = state.$contract.length;
            state.projectCount = state.$project.length;
            return Ux.promise(state);
        }).then(Ux.ready).then(Ux.pipe(reference));
    });
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.App")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        const config = Ux.inConfig(this);
        const {total = {}, oa = {}} = config;
        const {$menus} = this.props;
        const menuItem = Ex.a4MenuDash($menus, this, Ux.Env.MENU_TYPE.NAV);
        return (
            <ProCard split={"horizontal"} className={"region"}>
                <ProCard split={"vertical"} title={total.title}>
                    <StatisticCard statistic={{
                        title: total.project.text,
                        description: total.project.description,
                        value: this.state.projectCount
                    }}/>
                    <StatisticCard statistic={{
                        title: total['contract'].text,
                        description: total['contract'].description,
                        value: this.state.contractCount
                    }}/>
                </ProCard>
                <ProCard split={"vertical"} title={oa.title}>
                    <div className={"app_link"}>
                        {menuItem.map(item => {
                            return (
                                <a href={""} key={item.key} onClick={event => {
                                    Ux.prevent(event);
                                    const {$router} = this.props;
                                    Ux.toRoute(this, item.uri, {target: $router.path()})
                                }}>
                                    {item.icon}
                                    <span>{item.text}</span>
                                </a>
                            )
                        })}
                    </div>
                </ProCard>
            </ProCard>
        )
    }
}

export default Component