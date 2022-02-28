import {Layout} from "antd";
import Ux from "ux";
import React from "react";
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
                    // eslint-disable-next-line
                    <a href={""} onClick={event => {
                        Ux.prevent(event);
                        Ux.toRoute(reference, "/development/index")
                    }}>
                        <img src={logo}
                             style={$logoCss}
                             alt={'Logo'}/>
                    </a>
                ) : (
                    <img src={logo}
                         alt={'Logo'}/>
                )}
            </div>
            {/** 左边 **/}
            {isFull ? Ux.aiSider(dataArray, attrs) : false}
        </Sider>
    )
}