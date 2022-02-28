import React from 'react';
import Ex from "ex";
import Ux from "ux";
import './Cab.less'

/**
 * ## 「组件」`ExNavigation`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 核心
 *
 * React属性props:
 *
 * 1. 全局：$router, $menus, $app, $user
 * 2. 统一：config, data
 * 3. 函数：fnApp, fnOut
 * 4. 风格：css
 *
 * css =
 *
 * ```js
 * {
 *      clsNav,
 *      clsBreadcrumb
 * }
 * ```
 *
 * config =
 *
 * ```js
 * {
 *      homepage
 * }
 * ```
 *
 * @memberOf module:web-component
 * @method *ExNavigation
 */
const yoNavigation = (reference = {}) => {
    const {data = [], source = [], config: {homepage}} = reference.props;
    // 配置中读取主页
    let $nav = [];
    if (homepage) {
        $nav.push(homepage);
    }
    let current = (data[0]) ? data[0].key : undefined;
    // 构造导航栏
    let navigator = Ux.elementBranch(source, current, "parentId");
    if (navigator) {
        navigator = navigator.sort((left, right) => left.level - right.level);
        navigator.forEach(item => $nav.push({
            key: item.name ? item.name : Ux.randomUUID(),
            text: item.text,
            // 必须添加"/"前缀，否则会生成错误路由
            uri: (item.uri && "EXPAND" !== item.uri) ? "/" + Ux.Env['ROUTE'] + item.uri : undefined
        }));
    }
    return $nav;
};
const renderJsx = (reference, {
    $navs = [],
    $router,
    extra,
    css: {
        clsNav = "ux-navigation",
        clsBreadcrumb = "breadcrumb"
    }
}) => (
    <div className={clsNav}>
        <div className={"ux-navigation-menu"}>
            {Ux.aiBreadcrumb($navs, {
                className: clsBreadcrumb
            }, {
                $router,
            })}
        </div>
        {extra ? (
            <div className={"ux-navigation-extra"}>
                {extra}
            </div>
        ) : false}
    </div>
)

class Component extends React.PureComponent {
    state = {$ready: true};

    render() {
        return Ex.yoRender(this, () => {
            const {$router, css = {}, extra} = this.props;
            return renderJsx(this, {
                css,
                extra,
                $router,
                $navs: yoNavigation(this)
            });
        }, Ex.parserOfColor("ExNavigation").private());

    }
}

export default Component;