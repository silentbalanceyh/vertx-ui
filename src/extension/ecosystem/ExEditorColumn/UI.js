import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Tabs} from "antd";
import {LoadingAlert} from "web";
import Event from './Op';
import Jsx from './Web';

/**
 * ## 「组件」`ExEditorColumn`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method *ExEditorColumn
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
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
    state.$selected = Event.valueDefault($combine);
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
    group.onChange = ($selected = []) => {
        /*
         * 设置选中项
         */
        reference.setState({$selected});
    };
    group.className = "group";
    state.$group = group;
    /*
     * Tab
     */
    const $tab = Ux.configTab(reference, tab);
    $tab.onTabClick = Event.rxActive(reference)
    state.$tab = $tab;
    if (page.complex) {
        page.complex.render = Ex.jsxItemTransfer(reference);
        page.complex.onChange = Event.action.rxChange(reference);
    }
    state.$page = page;
    state.$ready = true;
    reference.setState(state);
};
const componentUp = (reference, virtualRef) => {
    const $visible = reference.props.$visible;
    const $visiblePre = virtualRef.props.$visible;
    if ($visible && !$visiblePre) {
        // 打开
        const {$combine = {}} = reference.state;
        const $selected = Event.valueDefault($combine);
        reference.setState({$selected});
    }
    if (!$visible && $visiblePre) {
        // 关闭
        reference.setState({$selected: [], $activeKey: "simple"});
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExEditorColumn")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $buttons: [],   // 按钮初始化
        $options: [],   // 全列初始化
        $selected: [],  // 选择项初始化
        $submitting: false,
    };

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(props, state, snapshot) {
        componentUp(this, {props, state})
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 根据核心状态处理
             */
            const {
                $buttons = [],
                $submitting = false, $notice,
                $tab = {}, $page = {},
                $activeKey = "simple",
                $combine = {}
            } = this.state;

            const buttons = Ux.clone($buttons);
            buttons.forEach(button => button.loading = $submitting);

            const {items = [], ...rest} = $tab;
            return (
                <div className={"ex-editor-dialog"}>
                    <div className={"checked-content"}>
                        <LoadingAlert $alert={$notice}/>
                        {Ex.jsxMyView(this, $combine.view)}
                        <Tabs {...rest} activeKey={$activeKey}>
                            {items.map(item => (
                                <Tabs.TabPane {...item}>
                                    {Ux.isFunction(Jsx[item.key])
                                        ? Jsx[item.key](this, $page[item.key]) : false}
                                </Tabs.TabPane>
                            ))}
                        </Tabs>
                    </div>
                    <div className={"button-active"}>
                        {/* 特殊按钮操作 */}
                        {buttons.map(button => Ux.aiButton(this, button))}
                    </div>
                </div>
            )
        }, Ex.parserOfColor("ExEditorColumn").private())
    }
}

export default Component;