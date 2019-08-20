import Ux from 'ux';
import Event from './Op.Event';

const yiEditor = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    /*
     * notice 专用
     */
    const {notice = {}} = config;
    state.$notice = Ux.clone(notice);
    /*
     * 选项处理
     */
    const {$columns = [], button = ""} = config;
    state.$options = $columns.map(column => {
        const option = {};
        option.key = column.dataIndex;
        option.label = column.title;
        option.value = column.dataIndex;
        return option;
    }).filter(column => "key" !== column.key);

    state.$selected = []; // Ux.clone($columnsMy);
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
export default {
    yiEditor,
}