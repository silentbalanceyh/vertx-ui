import Ux from "ux";
/*
 * paramView: {
 *     uid: xxx,
 *     view: xxx,
 *     position: xxx
 * },
 * paramVisit: {
 *     visitant 参数
 * }
 */
const aclArgument = (reference) => {
    const parameters = {};
    const {config: {webData = {}}} = reference.props;
    const {
        paramIn = {},
        paramView = {},         // S_VIEW
        paramVisit,             // S_VISITANT
    } = webData;
    const parsed = Ux.parseInput(paramIn, reference);
    const $paramView = Ux.formatExpr(paramView, parsed, true);
    if (paramVisit)
        parameters.paramVisit = Ux.formatExpr(paramVisit, parsed, true);
    // Unique key for paramView
    if ($paramView.view && $paramView.position)
        $paramView.uid = Ux.encryptMD5($paramView.position + "/" + $paramView.view);
    parameters.paramView = $paramView;
    return parameters;
}
const aclInput = (reference, param = {}) => {
    const {
        webOption
    } = param;
    return {
        state: reference.state,
        props: reference.props,
        option: webOption,
    }
}
/*
 * 1. Array：直接赋值
 * 2. Object：分组型，提取每个符合条件的 key = value, value
 * 3. preFn：数据源过滤函数
 */
const aclSource = (reference, param = {}) => {
    let source = [];
    const {data} = reference.props;
    if (data) {
        if (Ux.isArray(data)) {
            source = Ux.clone(data);
        } else {
            source = Ux.elementFlip(data);
        }
    }
    const {webFn = {}} = param;
    if (webFn.preFn) {
        source = webFn.preFn(source);
    }
    return source;
}
const aclMapping = (reference, param = {}, flag) => {
    const {webValue: {metadata = {}}} = param;
    const configured = metadata[flag];
    const {mapping = {}} = configured;
    if (Ux.isEmpty(mapping)) {
        mapping.key = "key";
    }
    return Ux.toKV(mapping);
}
export default {
    aclMapping,
    aclSource,
    aclInput,
    aclArgument,
}