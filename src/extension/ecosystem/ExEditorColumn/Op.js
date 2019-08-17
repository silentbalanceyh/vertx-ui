import Ux from 'ux';
import Event from './Op.Event';
import U from 'underscore';

const yiEditor = (reference) => {
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
            if (U.isFunction(onClick)) {
                onClick = onClick(reference);
                if (U.isFunction(onClick)) {
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
export default {
    yiEditor
}