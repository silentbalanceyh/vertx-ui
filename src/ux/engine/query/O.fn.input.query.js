import Abs from '../../abyss';
import Dev from '../../develop';

import U from 'underscore';
import Cmn from "./I.common";
import Rdr from './render';

/**
 * ## 标准函数
 *
 * 针对查询专用表单的条件数据收集处理，大部分是多选解析专用。
 *
 * @memberOf module:_qr
 * @method qrForm
 * @param {Object} input 输入的字段信息。
 * @param {String} connector 查询条件。
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Object} 返回最终查询条件，写入$filters变量。
 */
export default (input, connector = "AND", reference) => {
    const condition = {};
    condition[""] = ("AND" === connector);
    /*
     * 条件专用
     */
    const {raft = {}} = reference.state ? reference.state : {};
    const {search = {}} = raft;
    Abs.itObject(input, (field, value) => {
        if (search.hasOwnProperty(field)) {
            const executor = Rdr[search[field]];
            if (U.isFunction(executor)) {
                executor(field, value, condition, reference);
            } else {
                Rdr.analyzePair(condition, field, value);
            }
        } else {
            Rdr.analyzePair(condition, field, value);
        }
    });
    const query = Cmn.finalize(condition);
    Dev.dgDebug({
        search, query
    }, "[ Qr ] 触发搜索", "#436EEE");
    return query;
};