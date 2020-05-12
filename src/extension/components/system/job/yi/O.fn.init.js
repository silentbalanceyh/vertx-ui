import Ux from 'ux';
import Ex from 'ex';
import Cfg from './O.config';
import Data from './O.data';

export default (reference) => {
    /*
     * 初始状态
     */
    const state = {};
    /*
     * tabs专用处理
     */
    return Ex.yiStandard(reference, state)
        .then(processed => Cfg.yiTable(reference)
            .then($table => Ux.promise(processed, "$table", $table))
        )
        .then(processed => Cfg.yiTabs(reference)
            .then($tabs => Ux.promise(processed, "$tabs", $tabs))
        )
        .then(processed => Cfg.yiMenu({state: processed, ...reference.state})
            .then($menus => Ux.promise(processed, "$menus", $menus))
        )
        .then(processed => Data.yiData(reference, processed))
        .then(state => {
            state.$counter = state.$aggregation;
            return Ux.promise(state);
        })
        .then(Ux.pipe(reference))
};