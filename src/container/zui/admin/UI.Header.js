import React from 'react'
import {Icon, Layout} from 'antd'
import Ux from 'ux';

import Account from './UI.Account'
import Notify from './UI.Notify'

const {Header} = Layout;

class Component extends React.PureComponent {

    render() {
        const {$_collapsed, fnCollapse} = this.props;
        return (
            <Header className="ux-header">
                <Icon className="trigger"
                      type={$_collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={fnCollapse}
                />
                <div className="right">
                    {/** 提醒菜单 **/}
                    <Notify/>
                    {/** 用户信息 **/}
                    <Account {...Ux.toProp(this.props, 'employee.js', 'router')} />
                </div>
            </Header>
        )
    }
}

export default Component
