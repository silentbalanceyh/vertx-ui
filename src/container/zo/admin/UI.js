import React from "react";
import Ex from 'ex';

import Ux from "ux";
import Logo from './image/logo.png';
import {ExAdmin} from "ei";
import Oi from "oi";
import {ViewTime} from "app";

const renderComponent = (reference) => {
    const {component: Component} = reference.props;
    const {$collapsed = false} = reference.state;
    const inherit = Ex.yoComponent(reference);
    inherit.$collapsed = $collapsed;
    return (
        <Component {...inherit}/>
    );
};
const renderDynamic = (reference) => {
    const {component: Component} = reference.props;
    const {$collapsed = false, $componentKey} = reference.state;
    const inherit = Ex.yoAtomComponent(reference);
    inherit.$collapsed = $collapsed;
    /*
     * 此处的 $componentKey 是必须的，为了生成新组件专用，如果没有这个
     * key 的变化过程，那么从静态页面切换到动态页面的时候，会出现
     * 1）界面本身不刷新
     * 2）所有子界面都不呈现出来
     * 界面刷新的BUG就是如此来的
     * $componentKey 的目的是让 Layout 强制 Component 刷新界面
     */
    return (
        <Component {...inherit} key={$componentKey}/>
    );
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .connect(state => Ux.dataIn(state)
        .rework({datum: ["menus"]})
        .revamp(["app", "user"])
        .to()
    )
    .loading("app", "menus")
    .connect({
        fnApp: Ex.epicInit,
        fnOut: Ux.fnOut,
    }, true)
    .state({
        $collapsed: false,
        $ready: false,
    })
    .to())
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiContainer(this);
    }

    /*
    由于路由切换时，此处的 componentDidMount会自动触发
    所以此处不需要更新容器的代码，不更新测试等待稳定会少一次
    配置数据的抓取，细粒度生命周期
    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuContainer(this, {
            props: prevProps,
            state: prevState,
        })
    }*/

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ex.yuContainer(this, {
            props: prevProps,
            state: prevState,
        })
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 容器处理
             */
            const container = Ex.yoAtomContainer(this, ExAdmin, Oi);
            const {Component, inherit} = container;
            /*
             * 动态和静态不同的处理办法
             */
            const {$dynamic = false} = this.state;
            return Component ? (
                <Component {...inherit}
                           $logo={Logo}
                           $logoCss={Ux.toCssLogo(this)}
                           $navExtra={<ViewTime/>}>
                    {$dynamic ?
                        renderDynamic(this, inherit) :
                        renderComponent(this)
                    }
                </Component>
            ) : false
        }, Ex.parserOfColor("PxSwitcher").dynamic());
    }
}

export default Component;
