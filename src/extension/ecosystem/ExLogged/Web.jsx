import Ux from "ux";
import {Avatar, Dropdown, Spin, Tooltip} from "antd";
import React from "react";
import Op from './Op';
import ExNotify from '../ExNotify/UI';

const yoIcon = (reference, type) => {
    const icon = {};
    icon.type = type;
    icon.className = "icon-top";
    const {$invert = false} = reference.props;
    if ($invert) {
        icon.theme = "filled";
    }
    return icon;
}

const renderCode = (reference, menu = []) => {
    const menuDev = menu.filter(item => "DEV-MENU" === item.type);
    if (0 < menuDev.length) {
        const info = Ux.fromHoc(reference, "info");
        const attrIcon = yoIcon(reference, "code");
        return (
            <Tooltip title={info['develop']} placement={"bottom"}>
                {Ux.v4Icon({
                    ...attrIcon,
                    onClick: event => {
                        Ux.prevent(event);
                        // 进入开发中心
                        Ux.toRoute(reference, "/development/index");
                    }
                })}
            </Tooltip>
        );
    } else return false;
}


const renderMessage = (reference, menu = []) => {
    const info = Ux.fromHoc(reference, "info");
    const attrIcon = yoIcon(reference, "bell");
    const config = {};
    config.tips = {
        title: info.message,
        placement: "bottom"
    }
    config.icon = attrIcon;
    return (
        <ExNotify config={config}/>
    )
}
const renderHelp = (reference, menu = []) => {
    const info = Ux.fromHoc(reference, "info");
    const attrIcon = yoIcon(reference, "question-circle");
    return (
        <Tooltip title={info.help} placement={"bottom"}>
            {Ux.v4Icon(attrIcon)}
        </Tooltip>
    );
}
const renderSetting = (reference, menu = [], params = {}) => {
    const source = menu; // .filter(item => Ux.Env.MENU_TYPE.SET === item.type);
    if (0 < source.length) {
        const attrIcon = yoIcon(reference, "setting");
        const {rxSetting} = reference.props;

        const {css = {}} = params;
        const {
            clsDropdown = "",
            clsMenu = ""
        } = css;

        const dropAttrs = {};
        dropAttrs.className = clsMenu;
        dropAttrs.placement = "bottomRight";
        dropAttrs.trigger = ["click"];
        dropAttrs.onVisibleChange = ($visibleSetting) => {
            Ux.of(reference).in({
                $visibleSetting
            }).hide().done();
            // reference.?etState({
            //     $visibleSetting,
            //     $visible: false,
            // })
        }
        const {$visibleSetting = false} = reference.state;
        dropAttrs.visible = $visibleSetting;
        if (Ux.isFunction(rxSetting)) {
            dropAttrs.overlay = rxSetting(source, {
                className: `ux-menu-drop ${clsDropdown}`,
                callback: () => {
                    Ux.of(reference).in({
                        $visibleSetting: false
                    }).hide().done();
                    // reference.?etState({
                    //     $visibleSetting: false,
                    //     $visible: false
                    // })
                }
            });
        } else {
            dropAttrs.overlay = Ux.aiMenuTop(source, {
                className: `ux-menu-drop ${clsDropdown}`,
                onClick: Op.rxSelect(reference),
            });
        }
        return (
            <Dropdown {...dropAttrs}>
                {Ux.v4Icon(attrIcon)}
            </Dropdown>
        );
    } else {
        return false;
    }
}
const renderAccount = (reference, {
    $data,
    $user,
    css: {
        clsDropdown = "",
        clsAccount = "",
        clsAvatar = "",
        clsUser = "",
        clsMenu = ""
    }
}) => {
    if ($user) {
        const dropAttrs = {};
        dropAttrs.className = clsMenu;
        dropAttrs.overlay = Ux.aiMenuTop($data, {
            className: `ux-menu-drop ${clsDropdown}`,
            onClick: Op.rxSelect(reference),
        })
        dropAttrs.onVisibleChange = ($visible) => {
            Ux.of(reference).in({
                $visibleSetting: false
            }).in({$visible}).done();
            // reference.?etState({
            //     $visibleSetting: false,
            //     $visible,
            // })
        }
        const {$visible = false} = reference.state;
        dropAttrs.visible = $visible;
        return (
            <Dropdown {...dropAttrs}>
                {/** 用户头像和名字，登陆后状态 **/}
                <span className={clsAccount}>
                <Avatar size="default" className={clsAvatar}
                        src={$user['logo'] ? $user['logo'] : "/img/zui/account/default.jpeg"}/>
                    <span className={clsUser}>{$user['realname'] ? $user['realname'] : $user['username']}</span>
                </span>
            </Dropdown>
        )
    } else {
        return (
            <Spin size="small" style={{marginLeft: 0}}/>
        )
    }
}
export default {
    renderMessage,
    renderCode,
    renderHelp,
    renderSetting,
    renderAccount,
}