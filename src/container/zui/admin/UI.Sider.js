import './Cab.less';
import React from 'react'
import Ux from 'ux'
import {Layout, Menu} from 'antd'
import {Link} from 'react-router-dom'

import Op from './Op.Effect';

const {Sider} = Layout;

class Component extends React.PureComponent {

    render() {
        const {$app, $menus, $_collapsed} = this.props;
        const dataUris = Op.fnUriMapping($menus.to());
        const dataArray = Op.fnMenuData($menus.to(), $app);
        return (
            <Sider trigger={null} collapsible collapsed={$_collapsed}
                   width={264} className="menu-sider">
                {/** 菜单顶部Logo链接 **/}
                <div className="menu-logo">
                    <Link to={Ux.Env.ENTRY_ADMIN}>
                        <img src={$app._("logo")} alt="Logo"/>
                        <h1>{$app._("title")}</h1>
                    </Link>
                </div>
                {/** 左边菜单项 **/}
                <Menu key="mSider" theme="dark" mode="inline"
                      style={{padding: '16px 0px', width: '100%'}}
                      defaultOpenKeys={["f6f5d6d3-253c-44a3-b323-fa3524487bf8"]}
                      onClick={Op.fnRouting(this, dataUris)}>
                    {dataArray.map(item => Ux.uiItemMenuTree({
                        ...item,
                        className: `menu-icon ${$_collapsed ? "menu-collapse" : ""}`
                    }))}
                </Menu>
            </Sider>
        )
    }
}

export default Component;
