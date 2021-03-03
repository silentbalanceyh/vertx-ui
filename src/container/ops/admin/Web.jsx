import Op from './Op';
import Ex from 'ex';
import React from 'react';

const renderComponent = (reference) => {
    const {component: Component} = reference.props;
    const {$collapsed = false, $identifier} = reference.state;
    const inherit = Ex.yoComponent(reference);
    inherit.$collapsed = $collapsed;
    inherit.$identifier = $identifier;
    return (
        <Component {...inherit}/>
    );
};
const renderDynamic = (reference) => {
    const {component: Component} = reference.props;
    const {$collapsed = false, $componentKey} = reference.state;
    const inherit = Op.yoComponent(reference);
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
export default (reference) => {
    /*
     * 容器处理
     */
    const container = Op.yoContainer(reference);
    const {Component, inherit} = container;
    /*
     * 动态和静态不同的处理办法
     */
    const {$dynamic = false} = reference.state;
    return Component ? (
        <Component {...inherit} >
            {$dynamic ?
                renderDynamic(reference, inherit) :
                renderComponent(reference)
            }
        </Component>
    ) : false
};