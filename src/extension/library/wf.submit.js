// ======================= 配置部分 =======================
import Ux from "ux";

const configUi = ($workflow = {}, key, array = false) => {
    const {config = {}} = $workflow;
    const {ui = {}} = config;
    const configData = ui[key];
    if (configData) {
        return configData;
    } else {
        return array ? [] : {};
    }
}
const configPhase = ($workflow = {}, configRef = {}) => {
    const phase = configUi($workflow, "phase");
    const {forbidden = []} = phase;
    /*
     * items配置：[
     *      "",
     *      "",
     * ]
     * 字符串模式
     */
    let {items = []} = configRef;
    items = Ux.clone(items);
    items = items.filter(item => {
        let key;
        if ("string" === typeof item) {
            key = item.split(',')[0];
        } else {
            key = item.key;
        }
        return !forbidden.includes(key);
    });
    return items;
}
// ======================= 数据部分 =======================
const RECORD = {
    LINKAGE: (values = {}, config = {}) => {
        const {linkage, field = "targetData"} = config;
        /*
         * 对应 X_LINKAGE，提取数据，基本规范
         * 1. 只能从[]中提取数据，类型是ARRAY
         * 2. 记录数据一般从 targetData 中取
         */
        const dataSource = values[linkage];
        if (Ux.isArray(dataSource)) {
            const recordData = dataSource.map(each => each[field])
                .filter(Ux.isObject)
                .filter(item => !!item)
            return Ux.isArray(recordData) ? recordData : [];
        } else {
            console.warn("数据源格式错误，必须是 ARRAY 格式。")
            return [];
        }
    }
}
const dataRequest = (params = {}, pWorkflow = {}, pConfig = {}) => {
    const parameters = Ux.valueRequest(params);
    parameters.workflow = Ux.valueOk(pWorkflow, [
        "definitionKey",
        "definitionId",
        "instanceId",
        "taskId"
    ]);
    const op = configUi(pWorkflow, "op");
    const {
        node,
        nodeOp,
    } = pConfig;
    Ux.dgDebug({node, op, nodeOp}, "节点数据：", "#ff8626")
    if (node && op[nodeOp]) {
        const taskData = op[nodeOp];
        const nodeData = taskData[node];
        if (nodeData) {
            Object.assign(parameters, nodeData);
        }
    }
    // request 转换规则
    if (!parameters.record) {
        const request = configUi(pWorkflow, "request");
        const {source, ...config} = request.record ? request.record : {};
        const recordFn = RECORD[source];
        if (Ux.isFunction(recordFn)) {
            parameters.record = recordFn(parameters, config);
        }
    }
    return parameters;
}

const VALIDATOR = {
    required: (params = {}, config = {}) => {
        const {message = ""} = config;
        const value = params[config.field];
        if (value) {
            if (Ux.isArray(value) && 0 === value.length) {
                return message;
            }
        } else {
            return message;
        }
    }
}

const dataVerify = (params = {}, pWorkflow = {}) => {
    const request = configUi(pWorkflow, "request");
    const {validation = {}} = request;
    if (Ux.isEmpty(validation)) {
        // 不做任何提交验证
        return false;
    }
    const keys = Object.keys(validation);
    for (let idx = 0; idx < keys.length; idx++) {
        const field = keys[idx];
        const rules = validation[field];
        for (let jdx = 0; jdx < rules.length; jdx++) {
            const rule = rules[jdx];
            const ruleConfig = {};
            ruleConfig.field = field;
            if ("string" === typeof rule) {
                const splitted = rule.split(',');
                ruleConfig.name = splitted[0];
                ruleConfig.message = splitted[1];
            } else {
                Object.assign(ruleConfig, rule);
            }
            const validatorFn = VALIDATOR[ruleConfig.name];
            if (Ux.isFunction(validatorFn)) {
                const validated = validatorFn(params, ruleConfig);
                if (validated) {
                    return validated;
                }
            }
        }
    }
    return false;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    dataVerify,
    dataRequest,
    configUi,
    configPhase
}