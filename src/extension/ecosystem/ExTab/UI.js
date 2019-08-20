import React from 'react';
import {Tabs} from 'antd';
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
    state = {};

    render() {
        const {
            config = {},
        } = this.props;
        const {items = []} = config;
        return (
            <Tabs {...config}>
                {items.map((item) => {
                    const {fnRender, ...rest} = item;
                    return (
                        <Tabs.TabPane {...item}>
                            {U.isFunction(fnRender) ? fnRender(this, rest) : false}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        );
    }
}

export default Component;