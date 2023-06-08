import React from 'react';
import Ux from 'ux';


/**
 * ## 「组件」`Navigation`
 *
 * > 旧名称依然可用：`PagerHeader`
 *
 * ```js
 * import { PagerHeader } from 'web';     // 旧版本
 * import { Navigation } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x| x | x |
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |$router||props|DataRouter|特殊属性$router用于执行路由操作的专用对象。|
 * |$navs||props|Array|每个元素最终用于`aiLink`操作。|
 *
 * > 面包屑导航渲染，通常用于主界面的二级面包屑导航，链接会禁用`<a/>`的`href`导航而采用`react-router`中的路由导航功能。
 *
 * @memberOf module:uca/economy
 * @method Navigation
 *
 */
class Component extends React.PureComponent {
    render() {
        const {$router, $navs = []} = this.props;
        return (
            <div className={"web-navigation"}>
                {Ux.aiBreadcrumb($navs, {className: "breadcrumb"}, {$router})}
            </div>
        );
    }
}

export default Component;
