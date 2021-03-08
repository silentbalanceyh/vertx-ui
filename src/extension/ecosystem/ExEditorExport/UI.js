import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import renderJsx from './Web.jsx';
import Event from "./Op";


/**
 * ## 「组件」`ExEditorExport`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * |-------------------------------|
 * | o___ o___ o___ o___ o___ o___ |
 * | o___ o___ o___ o___ o___ o___ |
 * | o___ o___ o___ o___ o___ o___ |
 * | o___ o___ o___                |
 * |          Save  Cancel         |
 * |-------------------------------|
 * ```
 *
 *
 * @memberOf module:web-component
 * @method ExEditorExport
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    /*
     * notice 专用
     */
    const {notice = {}} = config;
    state.$notice = Ux.clone(notice);
    /*
     * 选项处理，默认全选
     */
    const {$columns = [], button = ""} = config;
    const $options = $columns.map(column => {
        const option = {};
        option.key = column.dataIndex;
        option.label = column.title;
        option.value = column.dataIndex;
        return option;
    }).filter(column => "key" !== column.key);
    state.$options = $options;
    /*
     * 默认全选
     */
    const selected = $options.map(item => item.key);
    state.$selected = selected;
    /*
     * Group专用
     */
    const group = {};
    group.onChange = (selected = []) => {
        /*
         * 设置选中项
         * 按照列呈现的本身顺序进行排序
         */
        const $selectedKeys = Ux.immutable(selected);
        const $selected = [];
        $options
            .filter(item => $selectedKeys.contains(item.key))
            .forEach(item => $selected.push(item.key));
        reference.setState({$selected});
    };
    group.className = "group";
    group.defaultValue = selected;
    state.$group = group;
    /*
     * 按钮专用选项
     */
    if ("string" === typeof button) {
        const $button = {};
        $button.id = button;
        $button.className = "ux-hidden";
        $button.onClick = Event.rxExport(reference);
        state.$button = $button;
    }
    state.$ready = true;
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
            /*
             * 根据核心状态处理
             */
            const {
                $button = {}, $options = [],
                $submitting = false,
                $group = {}, $notice = {},
            } = this.state;
            /*
             * 选项处理
             */
            const group = Ux.clone($group);
            const button = Ux.clone($button);
            if (!Ux.isEmpty(button)) {
                button.loading = $submitting;
            }
            /*
             * 受控选项处理，默认权限
             */
            return renderJsx(this, {
                button,
                options: Ux.clone($options),
                notice: Ux.clone($notice),
                group,
            });
        }, Ex.parserOfColor("ExEditorExport").private());
    }
}

export default Component;