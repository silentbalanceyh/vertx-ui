import {Layout} from "antd";
import Ux from "ux";
import React from "react";
import {Link} from "react-router-dom";
import Empty from "./image/empty.jpg";
import './Cab.less';

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
    return (
        <Sider {...$attrsSider}>
            {/* 菜单顶部Logo */}
            <div className="logo">
                <Link to={Ux.Env.ENTRY_ADMIN}>
                    <img src={logo}
                         alt={'Logo'}/>
                </Link>
            </div>
            {/** 左边 **/}
            {Ux.aiSider(dataArray, $attrsMenu)}
        </Sider>
    )
}