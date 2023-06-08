import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Tabs} from "antd";
import {LoadingAlert} from "web";
import Event from './Op';
import Jsx from './Web';
import "./Cab.norm.scss";
import Sk from 'skin';

/**
 * ## 「组件」`ExEditorColumn`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method *ExEditorColumn
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExEditorColumn";
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 动态还是静态
     */
    const $combine = Ex.yiCombine(reference, config);
    const state = {};
    state.$combine = $combine;
    const {notice, tab = {}, page = {}} = $combine;
    state.$notice = Ux.clone(notice);
    const {$columns = []} = $combine;
    state.$options = $columns.map(column => {
        const option = {};
        option.key = column.dataIndex;
        option.label = column.title;
        option.value = column.dataIndex;
        return option;
    }).filter(column => "key" !== column.key);
    /*
     * 选择项
     */
    state.$selectedKeys = Event.valueDefault($combine);
    /*
     * 按钮专用处理
     */
    state.$buttons = Ux.clone($combine.buttons).map(button => {
        if ("string" === typeof button.event) {
            let onClick = Event.action[button.event];
            if (Ux.isFunction(onClick)) {
                onClick = onClick(reference);
                if (Ux.isFunction(onClick)) {
                    button.onClick = onClick;
                }
            }
        }
        return button;
    });
    /*
     * Group专用
     */
    const group = {};
    const callback = ($selectedKeys = []) =>
        Ux.of(reference).in({$selectedKeys}).done();
    // reference.?etState({$selectedKeys});
    group.onChange = callback;
    group.className = "group";
    state.$group = group;
    /*
     * Tab
     */
    const $tab = Ux.configTab(reference, tab);
    $tab.onTabClick = Event.rxActive(reference)
    state.$tab = $tab;
    if (page.complex) {
        page.complex.render = (item) => Ux.aiItemTransfer(item, reference);
        page.complex.onChange = Ux.xtTransfer(reference, callback);
    }
    state.$page = page;
    Ux.of(reference).in(state).ready().done();
    //state.$ready = true;
    //this.?etState(state);
};
// const componentUp = (reference, virtualRef) => {
//     const $visible = reference.props.$visible;
//     const $visiblePre = virtualRef.props.$visible;
//     if ($visible && !$visiblePre) {
//         // 打开
//         const {$combine = {}} = reference.state;
//         const $selectedKeys = Event.valueDefault($combine);
//         Ux.of(reference).in({$selectedKeys}).done();
//         // reference.?etState({$selectedKeys});
//     }
//     if (!$visible && $visiblePre) {
//         // 关闭
//         Ux.of(reference).in({
//             $selectedKeys: [],
//             $activeKey: "simple"
//         }).done();
//         // reference.?etState({$selectedKeys: [], $activeKey: "simple"});
//     }
// }

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    state = {
        $buttons: [],   // 按钮初始化
        $options: [],   // 全列初始化
        $selectedKeys: [],  // 选择项初始化
        $submitting: false,
    };

    componentDidMount() {
        componentInit(this);
    }

    // componentDidUpdate(props, state, snapshot) {
    //     componentUp(this, {props, state})
    // }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 根据核心状态处理
             */
            const {
                $buttons = [],
                $notice,
                $tab = {}, $page = {},
                $activeKey = "simple",
                $combine = {}
            } = this.state;

            const buttons = Ux.clone($buttons);
            // $submitting = false
            const $submitting = Ux.of(this).is.submitting();
            buttons.forEach(button => button.loading = $submitting);

            const {items = [], ...rest} = $tab;
            // v4
            const $items = Ux.v4Items(items, {
                // itemFn: 默认
                childFn: (item = {}, reference) =>
                    Ux.isFunction(Jsx[item.key])
                        ? Jsx[item.key](reference, $page[item.key])
                        : false
            }, this);
            /*
                            {items.map(item => (
                                <Tabs.?abPane {...item}>
                                    {Ux.isFunction(Jsx[item.key])
                                        ? Jsx[item.key](this, $page[item.key]) : false}
                                </Tabs.?abPane>
                            ))}
             */
            const attrEditor = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrEditor}>
                    <div className={"ux_popover_body"}>
                        <LoadingAlert $alert={$notice}/>
                        {Ux.aiViewMy($combine.view, this)}
                        <Tabs {...rest}
                              activeKey={$activeKey}
                              items={$items}/>
                    </div>
                    <div className={"ux_popover_footer"}>
                        {/* 特殊按钮操作 */}
                        {buttons.map(button => Ux.aiButton(this, button))}
                    </div>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).private())
    }
}

export default Component;