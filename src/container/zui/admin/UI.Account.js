import React from 'react'
import Ux from 'ux'
import Op from './Op';
import {Avatar, Dropdown, Spin} from 'antd'

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Account")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {$hoc} = this.state;
        const $user = Ux.isLogged();
        const menuData = $hoc._("menu");
        return ($user ? (
            <Dropdown overlay={Ux.aiMenuTop(menuData, {}, {onClick: Op.fnSelect(this)})}>
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
