import React from 'react';
import Op from './Op';
import renderJsx from './Web.jsx';
import Ex from "ex";

/*
 * React属性props:
 * 1) 全局：$router, $menus, $app, $user
 * 2) 统一：config, data
 * 3) 函数：fnApp, fnOut
 * 4) 风格：css
 * css =
 * {
 *      clsNav,
 *      clsBreadcrumb
 * }
 * config =
 * {
 *      homepage
 * }
 */
class Component extends React.PureComponent {
    state = {$ready: true};

    render() {
        return Ex.yoRender(this, () => {
            const {$router, css = {}} = this.props;
            return renderJsx(this, {
                css,
                $router,
                $navs: Op._1normalizeNavs(this)
            });
        }, Ex.parserOfColor("ExNavigation").private());

    }
}

export default Component;