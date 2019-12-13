import T from "./I.common";

export default (field, value = {}, condition = {}) => {
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
        T.analyzePair(condition, "$" + field, complex);
    } else if (value.start) {
        /*
         * 只有开始时间，查询大于这个时间的
         */
        const fieldNorm = field + ",>";
        const fieldValue = value.start.toISOString();
        T.analyzePair(condition, fieldNorm, fieldValue);
    } else if (value.end) {
        /*
         * 只有结束时间，查询小于这个时间的
         */
        const fieldNorm = field + ",<";
        const fieldValue = value.end.toISOString();
        T.analyzePair(condition, fieldNorm, fieldValue);
    }
}