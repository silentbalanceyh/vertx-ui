import Abs from '../../abyss';
import Dev from '../../develop';

import U from 'underscore';
import Cmn from "./I.common";
import Rdr from './render';

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