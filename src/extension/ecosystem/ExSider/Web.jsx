import {Layout} from "antd";
import Ux from "ux";
import React from "react";
import {Link} from "react-router-dom";
import Empty from "./image/empty.jpg";
import './Cab.less';
import ExLogo from "../ExLogo/UI";

const {Sider} = Layout;

export default (reference, {
    $app,
    $attrsMenu = {},
    $attrsSider = {},
    dataArray = [],
}) => {
    let logo = $app ? $app._("logo") : undefined;
    if (!logo) {
        const {$logo} = reference.props;
        logo = $logo ? $logo : Empty;
    }
    const {$logoCss = {}} = reference.props;
    const {$keySet = {}} = reference.state;
    const attrs = {};
    Object.assign(attrs, $keySet, $attrsMenu);
    // 限制登陆
    const user = Ux.isLogged();
    const isFull = !user.limitation;
    return (
        <Sider {...$attrsSider}>
            {/* 菜单顶部Logo */}
            <div className={`logo`}>
                {isFull ? (
                    <Link to={Ux.Env.ENTRY_ADMIN}>
                        <ExLogo data={logo}
                                $logoCss={$logoCss}/>
                    </Link>
                ) : (
                    <ExLogo data={logo}
                            $logoCss={$logoCss}/>
                )}
            </div>
            {/** 左边 **/}
            {isFull ? Ux.aiSider(dataArray, attrs) : false}
        </Sider>
    )
}