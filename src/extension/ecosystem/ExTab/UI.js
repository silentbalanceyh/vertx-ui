import React from 'react';
import Ex from 'ex';
import {Tabs} from 'antd';
import Ux from 'ux';

/**
 * ## 「组件」`ExTab`
 *
 * ```js
 * import { ExTab } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * ### 2. 核心
 *
 * React属性props:
 *
 * ```js
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config:{
 *          tabs的基本配置信息
 *      },
 *
 *      // 上层传入
 *      $activeKey: "被激活的tabs页",
 *      $items: [
 *          所有目前打开的 tabs 页的数量
 *      ]
 * }
 * ```
 *
 * @memberOf module:uca/extension
 * @method ExTab
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExTab";

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: true
    };

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}} = this.props;
            const tabs = Ux.configTab(this, config);
            const {forceRender = []} = tabs;
            /*if (0 < forceRender.length) {
                tabs.items.forEach(item => {
                    if (forceRender.includes(item.key)) {
                        item.forceRender = true;
                    }
                })
            }*/
            /*
             * items 抽取
             */
            const {items = [], fnExtra, ...rest} = tabs;
            if (0 < forceRender.length) {
                items.forEach(item => {
                    if (forceRender.includes(item.key)) {
                        item.forceRender = true;
                    }
                })
            }
            /*
             * className
             */
            if (rest.className) {
                rest.className = `ux_tab ${rest.className}`;
            } else {
                rest.className = `ux_tab`;
            }
            if (Ux.isFunction(fnExtra)) {
                rest.tabBarExtraContent = fnExtra();
            }
            /*
             * 外层和里层的 activeKey 交替关系
             */
            if (config.activeKey) {
                /*
                 * 外层传入了 activeKey（受控模式）
                 */
                rest.activeKey = config.activeKey;
            } else {
                /*
                 * 里层提供了 activeKey（受控模式）
                 */
                if (tabs.activeKey) {
                    rest.activeKey = tabs.activeKey;
                }
                /*
                 * 其余情况为不受控模式
                 */
            }
            Ux.bind(this, rest, [
                "TabClick"
            ]);
            return (
                // v4 Tabs.?abPane deprecated
                <Tabs {...rest}
                      items={items.map(item => Ux.v4Child(item))}/>
                // v4 {items.map(item => Ux.aiChild(item))}
            );
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;