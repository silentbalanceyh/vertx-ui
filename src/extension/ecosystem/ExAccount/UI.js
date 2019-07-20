import React from 'react';
import Ux from 'ux';
import {Avatar, Dropdown, Spin} from 'antd'
import Op from './Op';
/**
 *  Css Hooker for Menu Item
 */
import './Cab.less';

/*
 * React属性props:
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据
 *      config:{
 *          window: {
 *              窗口配置信息
 *          }
 *      },
 *      css:{
 *          clsDropdown: "",
 *          clsAccount: "",
 *          clsAvatar: "",
 *          clsUser: ""
 *      },
 *      data:[
 *          菜单基本数据
 *      ],
 *      fnOut: 专用 redux 写树函数
 * }
 */
class Component extends React.PureComponent {
    render() {
        const $user = Ux.isLogged();
        const {css = {}} = this.props;
        /*
         * 风格数据
         */
        const {
            clsDropdown,
            clsAccount,
            clsAvatar,
            clsUser
        } = css;
        /*
         * 路径信息
         * */
        const src = ($user['logo'] ? $user['logo'] : "/img/zui/account/default.jpeg");
        const menus = Op._1normalizeMenu(this);
        return $user ? (
            <Dropdown overlay={Ux.aiMenuTop(menus, {
                className: clsDropdown,
            }, {onClick: Op._2fnSelect(this)})}>
                {/** 用户头像和名字，登陆后状态 **/}
                <span className={clsAccount}>
                    <Avatar size="default" className={clsAvatar}
                            src={src}/>
                    <span className={clsUser}>{$user['realname']}</span>
                </span>
            </Dropdown>
        ) : (<Spin size="small" style={{marginLeft: 0}}/>)
    }
}

export default Component;