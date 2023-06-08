import React from 'react';
import {ProCard, StatisticCard} from '@ant-design/pro-components';
import Ux from 'ux';
import Ex from 'ex';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.App")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const config = Ux.inConfig(this);
        const {$menus} = this.props;
        const menuItem = Ex.a4MenuDash($menus, this, Ux.Env.MENU_TYPE.NAV);
        return (
            <ProCard split={"vertical"} title={config.title}>
                {menuItem.map(item => {
                    return (
                        <StatisticCard className={"app"} statistic={{
                            value: item.text,
                            title: item.uri,
                            icon: item.icon,
                        }} key={item.key} onClick={event => {
                            Ux.prevent(event);
                            const {$router} = this.props;
                            Ux.toRoute(this, item.uri, {target: $router.path()})
                        }}>
                        </StatisticCard>
                    )
                })}
            </ProCard>
        )
    }
}

export default Component