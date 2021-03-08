import React from 'react';
import Ex from 'ex';
import {Tabs} from 'antd';
import Ux from "ux";
import Op from "./Op";
import Jsx from './Web';

/**
 * ## 「组件」`ExWizard`
 *
 * ```js
 * import { ExWizard } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method ExWizard
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * tabs 动态专用处理
     */
    const {config = {}} = reference.props;
    const {tabs = {}, page = {}, window, table = {}} = config;
    const $tabs = Ux.configTab(reference, tabs);
    if (Ux.isObject($tabs.items[0])) {
        $tabs.items[0].closable = false;
    }
    $tabs.hideAdd = true;
    $tabs.type = "editable-card";
    $tabs.onEdit = Op.rxEditTab(reference);
    state.$tabs = $tabs;
    state.$page = page;
    /*
     * alert 配置
     */
    const dialogRaw = Ux.aiExprWindow(window);
    state.$op = dialogRaw.onOk;

    state.$dialog = Ux.configDialog(reference, window);
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.className = "web-table";
    $table.rowSelection = {
        type: "radio",
        onChange: ($selected = []) => reference.setState({$selected})
    };
    state.$table = $table;
    const {alert} = config;
    if (alert) {
        state.$alert = Ux.clone(alert);
    }
    reference.setState(state);
};

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$tabs = {}} = this.state;
            const fnRender = [
                () => Jsx.renderSearch(this),
                (item) => Jsx.renderDynamic(this, item),
            ];
            const {items = [], ...rest} = $tabs;
            return (
                <div>
                    <Tabs {...rest}>
                        {items.map((item, index) => {
                            const fun = fnRender[index];
                            return (
                                <Tabs.TabPane {...item}>
                                    {Ux.isFunction(fun) ? fun(item) : false}
                                </Tabs.TabPane>
                            )
                        })}
                    </Tabs>
                    {Jsx.renderDialog(this)}
                </div>
            )
        }, Ex.parserOfColor("ExWizard").component())
    }
}

export default Component;