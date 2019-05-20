import React from 'react'
import Ex from '../Ex'
import Fn from '../Fx';
import {Tabs} from "antd";
import RENDERS from './UI.Render';

@Ex({
    // 1. 验证专用函数
    verify: Fn.verify,
    // 2. 初始化状态的专用函数（静态配置初始化）
    hoc: Fn.init,
    // 3. 类型处理
    type: "grid",
    // 4. 初始化状态
    state: {
        tabs: {},
        options: {}
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        // 动态配置初始化
    }

    render() {
        const $tabs = Fn.configTab(this);
        const {items = [], ...rest} = $tabs;
        return (
            <Tabs {...rest}>
                {items.map(item => {
                    const {type, ...itemRest} = item;
                    const fnRender = RENDERS[type];
                    /* */
                    return (
                        <Tabs.TabPane {...itemRest}>
                            {fnRender(this, itemRest, rest.activeKey)}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        )
    }
}

export default Component