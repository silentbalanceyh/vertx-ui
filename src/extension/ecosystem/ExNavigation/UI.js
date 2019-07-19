import React from 'react';
import Ux from 'ux';
import Op from './Op';

/*
 * React属性props:
 * {
 *      $router: DataRouter - （react-router）构造对象,
 *      $menus: DataArray - 菜单信息,
 *      config:{
 *          homepage: 主页对象，描述主页导航信息
 *      },
 *      css:{
 *          clsNav: "",
 *          clsBreadcrumb: ""
 *      }
 * }
 */
class Component extends React.PureComponent {
    render() {
        const {$router, css = {}} = this.props;
        const $navs = Op._1normalizeNavs(this);
        /*
         * 风格专用处理
         */
        const {
            clsNav = "",
            clsBreadcrumb = ""
        } = css;
        return (
            <div className={clsNav}>
                {Ux.aiBreadcrumb($navs, {
                    className: clsBreadcrumb
                }, {$router})}
            </div>
        );
    }
}

export default Component;