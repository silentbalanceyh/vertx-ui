import React from 'react';
import Event from './Op';
import Ex from 'ex';
import Ux from 'ux';
import renderJsx from './Web.jsx';

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
 * @method ExEditorColumn
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 动态还是静态
     */
    const state = {};
    const {$columns = [], $columnsMy = []} = config;
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
    state.$selected = Ux.clone($columnsMy);
    /*
     * 按钮专用处理
     */
    state.$buttons = Ux.clone(config.buttons).map(button => {
        if ("string" === typeof button.event) {
            let onClick = Event[button.event];
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

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 根据核心状态处理
             */
            const {
                $buttons = [], $options = [],
                $submitting = false,
                $group = {}, $selected = []
            } = this.state;

            const buttons = Ux.clone($buttons);
            buttons.forEach(button => button.loading = $submitting);
            /*
             * 选项处理
             */
            const group = Ux.clone($group);
            group.value = $selected;
            return renderJsx(this, {
                group,
                options: Ux.clone($options),
                buttons
            });
        }, Ex.parserOfColor("ExEditorColumn").private())
    }
}

export default Component;