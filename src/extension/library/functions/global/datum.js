import U from 'underscore';
import Ux from 'ux';

const array = (data) => {
    if (data && U.isFunction(data.to)) {
        /*
         * Data Array
         */
        const $data = data.to();
        if (U.isArray($data)) {
            return Ux.clone($data);
        } else {
            return [];
        }
    } else {
        /*
         * JavaScript Array
         */
        if (U.isArray(data)) {
            return Ux.clone(data);
        } else {
            return [];
        }
    }
};
/*
 * 统一执行 executor
 * 函数格式：
 * const fun = (reference) => (id, record) => {}
 * 1）reference：当前组件，如 ExTable
 * 2）id：记录的ID
 * 3）record：记录数据全部
 * 合并 executor 的方式：
 * 1）来源于 reference.props 中的 $executor 变量
 * 2）标准函数：
 * -- fnEdit：打开编辑Tab页专用
 * -- fnDelete：删除一行记录专用
 */
const executor = (reference, EVENTS = {} /* fnEdit, fnDelete */) => {
    /*
     * 基本规范，executor 必须是 fn 打头的
     */
    const events = {};
    Object.keys(EVENTS)
        .filter(key => key.startsWith('fn'))
        .filter(key => U.isFunction(EVENTS[key]))
        .forEach(key => events[key] = EVENTS[key]);
    let executor = Ux.clone(events);
    const {$executor = {}} = reference.props;
    if (!Ux.isEmpty($executor)) {
        /*
         * 如果 $executor 中包含了 fnEdit / fnDelete 会被覆盖掉
         */
        Object.assign(executor, $executor);
    }
    return executor;
};
export default {
    array,
    executor,
}