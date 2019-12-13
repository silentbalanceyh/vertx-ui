import U from "underscore";
import Ut from '../../unity';
import Cmn from './I.common';
/*
 * query 专用的表单
 */
import qrForm from './O.fn.input.query';

const qrTerms = (columns = []) => {
    /*
     * 在列确认之后，执行 $terms 变量的注入
     * $terms 记录了列变更的类型，用于后续的列变更专用处理
     */
    let $terms = {};
    if (U.isArray(columns)) {
        /*
         * 1）列定义中包含了当前字段（ dataIndex = field ）
         * 2）列定义中包含了 $filter 字段
         * 3）直接读取 $filter 中的 type 类型
         * 4）$filter 中的 type 值默认：INNER-DIRECT
         */
        columns.forEach(column => {
            const field = column.dataIndex;
            const filter = column['$filter'];
            if (filter) {
                $terms[field] = {};
                $terms[field].type = filter.type ? filter.type : "DIRECT";
                const {config = {}} = filter;
                if (config.dataType) {
                    $terms[field].dataType = config.dataType;
                } else {
                    /*
                     * 默认的搜索模式
                     */
                    $terms[field].dataType = "STRING";
                }
            }
        });
    }
    Object.freeze($terms);
    return $terms;
};
const qrClear = (reference = {}, state = {}) => {
    let append = state ? state : {};
    Object.assign(append, {$condition: {}});
    reference.setState(append);

    const {$terms = {}} = reference.state ? reference.state : {};
    Object.keys($terms)
        /* 列筛选必须调用 */
        .map(id => `__BTN_CLEAR_${id}`)
        .forEach(id => Ut.connectId(id))
};
const qrInput = (cond = [], value) => {
    const condition = {};
    if (value) {
        cond.forEach(field => condition[field] = value);
    } else {
        cond.forEach(field => condition[field] = "__DELETE__");
    }
    condition[""] = false;
    return Cmn.finalize(condition);
};
export default {
    /*
     * 列筛选中配置了 $filter，需要根据 $filter 生成配置
     * 1）$filter 的类型信息
     * 2）$filter 列的数据类型（后端查询需要使用）
     */
    qrTerms,
    /*
     * 清除当前 $condition 的条件
     * 清除当前 $searchText
     */
    qrClear,
    /*
     * 提取参数专用方法
     * 1）qrInput：单字段多值 Or 连接（主要针对单独输入框）
     * 2）qrForm：完整表单（针对Form提交的核心数据）
     */
    qrInput,
    qrForm,
}