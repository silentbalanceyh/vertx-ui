import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {Tabs} from 'antd';
import Ux from 'ux';
import './Cab.less';

const LOG = {
    name: "ExTab",
    color: "#5D478B"
};

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
            /*
             * items 抽取
             */
            const {items = [], ...rest} = $tabs;
            /*
             * className
             */
            if (rest.className) {
                rest.className = `ex-tabs ${rest.className}`;
            } else {
                rest.className = `ex-tabs`;
            }
            return (
                <Tabs {...rest}>
                    {items.map(item => Ux.aiChild(item))}
                </Tabs>
            );
        }, LOG)
    }
}

export default Component;