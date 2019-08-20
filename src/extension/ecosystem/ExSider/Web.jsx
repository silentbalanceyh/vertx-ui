import {Layout, Menu} from "antd";
import Op from "./Op";
import Ux from "ux";
import React from "react";
import {Link} from "react-router-dom";
import Empty from "./image/empty.jpg";

const {Sider} = Layout;

export default (reference, {
    $app,
    $collapsed = false,
    $theme = "dark",
    dataUri = {},
    dataArray = [],
    css: {
        clsSider = "",
        clsSiderExpand = ""
    }
}) => (
    <Sider trigger={null}
           collapsible
           collapsed={$collapsed}
           className={$collapsed ? clsSider : `${clsSider} ${clsSiderExpand}`}>
        {/* 菜单顶部Logo */}
        <div className="logo">
            <Link to={Ux.Env.ENTRY_ADMIN}>
                <img src={$app.isEmpty() ? Empty : $app._("logo")}
                     alt={'Logo'}/>
                <h1>{$app._("title")}</h1>
            </Link>
        </div>
        {/** 左边 **/}
        <Menu key="mSider" theme={$theme} mode={"inline"}
              style={{padding: '16px 0px', width: '100%'}}
              onClick={Op._2fnRouting(reference, dataUri)}>
            {dataArray.map(item => Ux.aiMenuTree({
                ...item,
                className: `icon ${$collapsed ? "collapse" : ""}`
            }))}
        </Menu>
    </Sider>
)