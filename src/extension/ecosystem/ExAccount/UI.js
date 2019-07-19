import React from 'react';
import Ux from 'ux';
import {Avatar, Dropdown, Spin} from 'antd'
import Op from './Op';

class Component extends React.PureComponent {
    render() {
        const $user = Ux.isLogged();
        const {data = [], css = {}} = this.props;
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
        console.info(this.props);
        return $user ? (
            <Dropdown overlay={Ux.aiMenuTop(data, {
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