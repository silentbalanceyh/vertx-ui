import Ex from 'ex';
import Ux from 'ux';
import FormAdd from '../form/UI.Free.Add';
import FormEdit from '../form/UI.Free.Edit';

const yoFreeList = (reference) => {
    const listAttrs = Ex.yoAmbient(reference);
    /*
     * 配置信息充值
     */
    listAttrs.config = Ux.fromHoc(reference, "grid");
    const {$query = {}} = reference.state;
    if (!Ux.isEmpty($query)) {
        listAttrs.$query = $query;
    }
    listAttrs.$form = {
        FormAdd,
        FormEdit
    }
    /*
     * 父类引用
     */
    listAttrs.rxPostOpen = Ex.rxPostOpen(reference);
    listAttrs.rxPostClose = Ex.rxPostClose(reference);
    return listAttrs;
}
const yiFreeList = (reference) => {
    const state = {};
    const $query = Ux.cabQuery(reference);
    if ($query) {
        state.$query = $query;
    }
    state.$ready = true;
    reference.setState(state);
}
export default {
    yoFreeList,
    yiFreeList,
}