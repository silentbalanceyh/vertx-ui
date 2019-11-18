import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {Tabs} from 'antd';
import Ux from 'ux';
import './Cab.less';
import U from 'underscore';

/*
 * React属性props:
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
 */
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiTab(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$tabs = {}} = this.state;
            const {config = {}} = this.props;
            /*
             * items 抽取
             */
            const {items = [], fnExtra, ...rest} = $tabs;
            /*
             * className
             */
            if (rest.className) {
                rest.className = `ex-tabs ${rest.className}`;
            } else {
                rest.className = `ex-tabs`;
            }
            if (U.isFunction(fnExtra)) {
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
                if ($tabs.activeKey) {
                    rest.activeKey = $tabs.activeKey;
                }
                /*
                 * 其余情况为不受控模式
                 */
            }
            return (
                <Tabs {...rest}>
                    {items.map(item => Ux.aiChild(item))}
                </Tabs>
            );
        }, Ex.parserOfColor("ExTab").component())
    }
}

export default Component;