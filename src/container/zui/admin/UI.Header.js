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
            <Header className="top-header">
                <Icon className="top-trigger"
                      type={$_collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={fnCollapse}
                />
                <div className="top-right">
                    {/** 提醒菜单 **/}
                    <Notify/>
                    {/** 用户信息 **/}
                    <Account {...Ux.toProp(this.props, 'user', 'router')} />
                </div>
            </Header>
        )
    }
}

export default Component
