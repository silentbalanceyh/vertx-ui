import React from 'react';
import Event from './Op';
import Ex from 'ex';
import Ux from 'ux';
import {Checkbox} from "antd";
import {LoadingAlert} from "web";

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
    const {notice} = $combine;
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
    state.$ready = true;
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
        reference.setState({$selected: []});
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
                $buttons = [], $options = [],
                $submitting = false,
                $group = {}, $selected = [],
                $combine = {}, $notice
            } = this.state;

            const buttons = Ux.clone($buttons);
            buttons.forEach(button => button.loading = $submitting);
            /*
             * 选项处理
             */
            const group = Ux.clone($group);
            group.value = $selected;
            const style = Ux.toGrid($combine);
            const {all} = $combine;
            return (
                <div className={"ex-editor-dialog"}>
                    <div className={"checked-content"}>
                        <LoadingAlert $alert={$notice}/>
                        <Checkbox.Group {...group}>
                            {$options.map(item => (
                                <div style={style} key={item.key} className={"item"}>
                                    <Checkbox key={item.key} value={item.key}>
                                        {item.label}
                                    </Checkbox>
                                </div>
                            ))}
                        </Checkbox.Group>
                        {all ? (
                            <div className={"all"}>
                                <Checkbox onChange={() => {
                                    if ($selected.length < $options.length) {
                                        const $values = $options.map(item => item.value);
                                        this.setState({$selected: $values})
                                    } else {
                                        this.setState({$selected: []});
                                    }
                                }} checked={$selected.length === $options.length}>{all}</Checkbox>
                            </div>
                        ) : false}
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