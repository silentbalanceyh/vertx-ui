import React from 'react'
import Ux from 'ux'
import Op from './Op';
import {Avatar, Dropdown, Menu, Spin} from 'antd'

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Account")
    .op("select", Op.fnSelect)
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {$hoc, $op} = this.state;
        const $user = Ux.isLogged();
        return ($user ? (
            <Dropdown overlay={
                /** 用户下拉菜单栏 **/
                <Menu className="top-menu" onClick={$op.select(this)}>
                    {$hoc._("menu").map(item => Ux.uiItemMenu(item))}
                </Menu>
            }>
                {/** 用户头像和名字，登陆后状态 **/}
                <span className="action account">
                    <Avatar size="default" className="avatar"
                            src={($user['logo'] ? $user['logo'] : "/img/zui/account/default.jpeg")}/>
                    <span className="name">{$user['realname']}</span>
                </span>
            </Dropdown>
        ) : (<Spin size="small" style={{marginLeft: 0}}/>))
    }
}

export default Component
