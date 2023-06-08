import Ux from "ux";
import __DATA from './workflow.__.fn.data.norm';
// ======================= indicator规则集 =======================
/*
 * 提取 form 中的 action 节点构造表单参数，最终返回数据
 * {
 *     "action": {},
 *     "validation": {},
 *     "workflow": {}
 * }
 */
const configRequest = (props = {}, nodeOp, params = {}) => {
    const {
        $workflow = {},
        config = {}
    } = props;
    const {form = {}} = config;
    const {action = {}} = form;
    const input = {};
    input.workflow = Ux.clone($workflow);
    if (nodeOp && action[nodeOp]) {
        const actionRef = Ux.clone(action[nodeOp]);
        if (actionRef) {
            const {
                data = {},
                indicator,
                validation = {},
                type = {},
            } = actionRef;
            input.validation = validation;
            input.type = type;
            input.action = Ux.valueIndicate(params, {
                data, indicator
            });
        }
    }
    if (!input.action) input.action = {};
    if (!input.validation) input.validation = {};
    // catalogPath for attachment processing
    if (params['linkageAttachment']) {
        const catalog = Ux.onDatum({props}, "service.catalog");
        const unique = Ux.elementUnique(catalog, "code", params['catalog']);
        const branch = Ux.elementBranch(catalog, unique.key, "parentId");
        input.action.catalogPath = branch.map(item => item.name).join('/');
    }
    return input;
}
/*
 * 请求标准化
 * 1. 提取工作流请求数据
 * 2. 验证规则处理
 * 3. 验证后标准化请求
 */
export default (reference, configuration = {}, params) => {
    const {
        op,
        callback = data => data,
    } = configuration;
    // 1. 配置准备
    const config = configRequest(reference.props, op, params);
    // 提取验证信息
    const {validation = {}, action = {}} = config;
    const paramsJ = Ux.clone(params);
    Object.assign(paramsJ, action);
    // Fix: https://github.com/silentbalanceyh/ox-engine/issues/1206
    return Ux.asyncValidate(validation, paramsJ, reference).then(validated => {
        // 请求标准化
        const request = __DATA.dataRequest(validated, config);
        if (Ux.isFunction(callback)) {
            const returned = callback(request);
            // 有返回值才提取返回值
            if (returned) {
                Object.assign(request, returned);
                // request = returned;
            }
        }
        return Ux.promise(request);
    })
}