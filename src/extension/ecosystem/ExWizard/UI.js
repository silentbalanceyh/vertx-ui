import React from 'react';
import Ex from 'ex';
import {Tabs} from 'antd';
import Ux from "ux";
import Op from "./Op";
import Jsx from './Web';
import Sk from 'skin';
import "./Cab.norm.scss";

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
 * @memberOf module:uca/extension
 * @method ExWizard
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExWizard";
const componentInit = (reference) => {
    const state = {};
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
    $table.className = "ux_table";
    $table.rowSelection = {
        type: "radio",
        onChange: ($selected = []) =>
            Ux.of(reference).in({$selected}).done()
        // reference.?etState({$selected})
    };
    state.$table = $table;
    const {alert} = config;
    if (alert) {
        state.$alert = Ux.clone(alert);
    }
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
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
            const $items = Ux.v4Items(items, {
                // itemFn
                // childFn,
                childFn: (item, _, index) => {
                    const fun = fnRender[index];
                    return Ux.isFunction(fun) ? fun(item) : false;
                }
            }, this);
            /*
                        {items.map((item, index) => {
                            const fun = fnRender[index];
                            return (
                                <Tabs.?abPane {...item}>
                                    {Ux.isFunction(fun) ? fun(item) : false}
                                </Tabs.?abPane>
                            )
                        })}
             */
            const attrEx = Sk.mixEx(UCA_NAME)
            return (
                <div {...attrEx}>
                    <Tabs {...rest} items={$items}/>
                    {Jsx.renderDialog(this)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;