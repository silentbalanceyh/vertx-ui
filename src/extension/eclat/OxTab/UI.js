import React from 'react';
import Ex from 'ex';
import {Tabs} from "antd";
import Ux from "ux";
import UI from "oi";

/**
 * ## 「组件」`OxTab`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method OxTab
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * 配置处理
     * 1.主配置
     * 2.子配置
     */
    const {config = {}, $controls = {}} = reference.props;
    /*
     * 主界面处理
     */
    const normalized = Ux.configTab(reference, config);
    const {controls = {}, ...$tabs} = normalized;
    /*
     * 处理 fnRender 部分
     */
    if (Ux.isArray($tabs.items)) {
        $tabs.items.forEach(item => {
            const controlId = controls[item.key];
            if (controlId) {
                const controlData = $controls[controlId];
                if (controlData) {
                    item.fnRender = (props) =>
                        /* controlData, props, state */
                        Ex.xuiDecorator(controlData, UI, props, reference.state);
                }
            }
        })
    }
    $tabs.className = "ex-tab"; // 特殊 css
    $tabs.onTabClick = () => {
        /* $switcher 变更 */
        const $switcher = Ux.randomString(32);
        reference.setState({$switcher});
    };
    state.$tabs = $tabs;
    const {$inited = {}} = reference.props;
    if (!Ux.isEmpty($inited)) {
        state.$inited = $inited;
    }
    reference.setState(state);
};

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * inherit 处理
             */
            const inherit = Ex.yoDynamic(this);

            const {$tabs = {}} = this.state;
            const {items = [], ...rest} = $tabs;
            return (
                <Tabs {...rest}>
                    {items.map(item => {
                        const {fnRender, ...itemRest} = item;
                        return (
                            <Tabs.TabPane {...itemRest}>
                                {Ux.isFunction(fnRender) ? fnRender(inherit) : false}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            );
        }, Ex.parserOfColor("OxTab").container())
    }
}

export default Component;