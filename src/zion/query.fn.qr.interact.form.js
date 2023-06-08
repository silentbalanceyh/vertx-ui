import __Zn from './zero.module.dependency';
import __QRP from './query.__.fn.qr.processor';

const Cv = __Zn.Env;

const __qrAnalyze = (condition = {}, field, value) => {
    if (value) {
        if (__Zn.isArray(value)) {
            if (0 === value.length) {
                condition[field] = Cv.CV_DELETE;
            } else {
                condition[field] = value;
            }
        } else {
            condition[field] = value;
        }
    } else {
        if (undefined === value) {
            condition[field] = Cv.CV_DELETE;
        }
    }
};


const aiSearchInput = (field, value = {}, condition = {}) => {
    let fieldNorm = "";
    if (!__Zn.isEmpty(value)) {
        fieldNorm = field + "," + value.op;
    } else {
        fieldNorm = field + ",c";
    }
    const text = value.text ? value.text : "";
    __qrAnalyze(condition, fieldNorm, text);
}
const aiSearchRangeDate = (field, value = {}, condition = {}) => {
    /*
     * 范围查询
     */
    if (value.start && value.end) {
        const complex = {};
        complex[""] = true;
        const startField = field + ",>";
        complex[startField] = value.start.toISOString();
        const endField = field + ",<";
        complex[endField] = value.end.toISOString();
        __qrAnalyze(condition, "$" + field, complex);
    } else if (value.start) {
        /*
         * 只有开始时间，查询大于这个时间的
         */
        const fieldNorm = field + ",>";
        const fieldValue = value.start.toISOString();
        __qrAnalyze(condition, fieldNorm, fieldValue);
    } else if (value.end) {
        /*
         * 只有结束时间，查询小于这个时间的
         */
        const fieldNorm = field + ",<";
        const fieldValue = value.end.toISOString();
        __qrAnalyze(condition, fieldNorm, fieldValue);
    }
}
// 字段级别执行
const __FIELD_RENDER = {
    aiSearchInput,
    aiSearchRangeDate
}

const qrForm = (input, connector = "AND", reference) => {
    const condition = {};
    condition[""] = ("AND" === connector);
    /*
     * 条件专用
     */
    const {raft = {}} = reference.state ? reference.state : {};
    const {metadata = {}} = raft;
    const {render = {}} = metadata;
    __Zn.itObject(input, (field, value) => {
        if (render.hasOwnProperty(field)) {
            const executor = __FIELD_RENDER[render[field]];
            if (__Zn.isFunction(executor)) {
                executor(field, value, condition, reference);
            } else {
                __qrAnalyze(condition, field, value);
            }
        } else {
            __qrAnalyze(condition, field, value);
        }
    });
    const query = __QRP.qrFinalize(condition);
    __Zn.dgDebug({
        render, query
    }, "[ Qr ] 触发搜索", "#436EEE");
    return query;
};
const qrNorm = (condition = {}, configuration) =>
    __QRP.qrNorm(condition, configuration);

export default {
    qrForm,
    qrNorm,
}