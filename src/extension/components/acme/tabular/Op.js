import Ux from 'ux';
import Ex from 'ex';
import FormAdd from "./form/UI.Add";
import FormEdit from "./form/UI.Edit";
import FormFilter from "./form/UI.Filter";

const rxSelect = (reference) => (selected = {}) => {
    /*
     * 设置 $query 专用
     */
    if (!Ux.isEmpty(selected)) {
        const {$query = {}} = reference.state;
        if (!$query.criteria) $query.criteria = {};
        $query.criteria['type,='] = selected.code;
        /*
         * 更新
         */
        reference.setState({
            $query: Ux.clone($query),   // 拷贝触发条件的变更
            $selected: true
        })
    }
};
const yiPage = (reference) => {
    const state = {};
    const config = Ux.fromHoc(reference, "grid");
    const $query = Ux.cabQuery(reference);
    if ($query) {
        state.$query = $query;
    }
    state.$selected = false;
    state.$config = Ux.clone(config);
    state.$ready = true;
    reference.setState(state);
};
const yoSider = (reference) => {
    const siderAttrs = Ex.yoAmbient(reference);
    siderAttrs.rxSelect = rxSelect(reference);
    return siderAttrs;
};
const yoList = (reference) => {
    const listAttrs = Ex.yoAmbient(reference);
    const {$query = {}, $config = {}} = reference.state;
    /*
     * 查询条件：重要
     */
    listAttrs.$query = Ux.clone($query);
    listAttrs.config = $config;
    listAttrs.$form = {
        FormAdd,    // 添加表单
        FormEdit,   // 更新表单
        FormFilter  // 搜索表单
    };
    listAttrs.rxPostOpen = Ex.rxPostOpen(reference);
    listAttrs.rxPostClose = Ex.rxPostClose(reference);
    return listAttrs;
};
export default {
    yiPage,
    yoSider,
    yoList,
}