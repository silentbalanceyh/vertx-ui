import Ex from "ex";
import Ux from "ux";
import FormAdd from './form/UI.Res.Add';
import FormEdit from './form/UI.Res.Edit';

const yoResList = (reference) => {
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
     * 父类引用处理 open / close
     */
    listAttrs.rxPostOpen = Ex.rxPostOpen(reference);
    listAttrs.rxPostClose = Ex.rxPostClose(reference);
    return listAttrs;
}
const yoResCriteria = (reference) => (keys = []) => {
    /*
     * 合并 $query 处理
     */
    const types = [];
    const identifiers = [];
    const {$treeData = []} = reference.props;
    /*
     * 直接过滤
     */
    const $keys = Ux.immutable(keys);
    $treeData.filter(item => $keys.contains(item.key)).forEach(item => {
        if (item.identifier) {
            identifiers.push(item.identifier);
        } else {
            types.push(item.code);
        }
    });
    /* 查询条件合并 */
    const condition = {};
    if (0 === types.length) {
        condition[`type,i`] = "__DELETE__"
    } else {
        condition[`type,i`] = types;
    }
    if (0 === identifiers.length) {
        condition[`identifier,i`] = "__DELETE__";
    } else {
        condition[`identifier,i`] = identifiers;
    }
    condition[""] = true;      // AND 操作符
    const {$query = {}} = reference.state;
    const normalized = Ux.qrCombine($query, reference, condition);
    reference.setState({$query: normalized});
}
const yiResPage = (reference) => {
    const state = {};
    const $query = Ux.cabQuery(reference);
    if ($query) {
        state.$query = $query;
    }
    state.$ready = true;
    reference.setState(state);
}
export default {
    yiResPage,
    yoResList,
    yoResCriteria
}