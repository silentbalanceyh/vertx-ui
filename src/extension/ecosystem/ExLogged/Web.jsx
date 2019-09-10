import {Avatar, Dropdown, Spin} from "antd";
import Ux from "ux";
import Op from "./Op";
import React from "react";
import './Cab.less';

export default (reference, {
    $data,
    $user,
    css: {
        clsDropdown = "",
        clsAccount = "",
        clsAvatar = "",
        clsUser = ""
    }
}) => $user ? (
    <Dropdown overlay={Ux.aiMenuTop($data, {
        className: clsDropdown,
        onClick: Op.onSelect(reference),
    })}>
        {/** 用户头像和名字，登陆后状态 **/}
        <span className={clsAccount}>
            <Avatar size="default" className={clsAvatar}
                    src={$user['logo'] ? $user['logo'] : "/img/zui/account/default.jpeg"}/>
            <span className={clsUser}>{$user['realname']}</span>
        </span>
    </Dropdown>
) : (<Spin size="small" style={{marginLeft: 0}}/>)