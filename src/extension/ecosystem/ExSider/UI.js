import React from 'react'
import {Layout, Menu} from 'antd';
import {Link} from "react-router-dom";
import Ux from "ux";
import Empty from "./image/empty.jpg";
import Op from './Op';

const {Sider} = Layout;

const jsxLogo = ($app) => (
    <div className="logo">
        <Link to={Ux.Env.ENTRY_ADMIN}>
            <img src={$app.isEmpty() ? Empty : $app._("logo")}
                 alt={'Logo'}/>
            <h1>{$app._("title")}</h1>
        </Link>
    </div>
);

/*
 * React属性props:
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $menus: DataArray - X_MENU 菜单数据,
 *      config: {
 *          collapsed: Boolean - 菜单是否折叠,
 *          theme: 当前菜单风格，默认值："dark"
 *      },
 *      data: [
 *          核心数据（菜单）
 *      ],
 *      fnOut: 专用 redux 写树函数
 *      css: {
 *          clsSider: "",
 *          clsSiderExpand: ""
 *      }
 * }
 */
class Component extends React.PureComponent {
    render() {
        const {$app, data = [], config = {}, css = {}} = this.props;
        const dataUri = Op._1normalizeUri(data);
        const dataArray = Op._1normalizeMenu(data, $app);
        /*
         * 基本配置
         */
        const {
            collapsed = true,
            theme = "dark"
        } = config;
        /*
         * 风格专用处理
         */
        const {
            clsSider = "",
            clsSiderExpand = "",
        } = css;
        return (
            <Sider trigger={null}
                   collapsible
                   collapsed={collapsed}
                   className={collapsed ? clsSider : `${clsSider} ${clsSiderExpand}`}>
                {/* 菜单顶部Logo */}
                {jsxLogo($app)}
                {/** 左边 **/}
                <Menu key="mSider" theme={theme} mode={"inline"}
                      style={{padding: '16px 0px', width: '100%'}}
                      onClick={Op._2fnRouting(this, dataUri)}>
                    {dataArray.map(item => Ux.aiMenuTree({
                        ...item,
                        className: `icon ${collapsed ? "collapse" : ""}`
                    }))}
                </Menu>
            </Sider>
        )
    }
}

export default Component;