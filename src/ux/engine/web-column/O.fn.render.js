import RENDERS from './I.render';

import U from 'underscore';
import Abs from '../../abyss';

export default (reference = {}, column = {}, ops) => {
    const {$render = "PURE"} = column;
    const executor = RENDERS[$render];
    if (U.isFunction(executor)) {
        /*
         * 过滤掉不支持过滤的情况
         */
        if (column.hasOwnProperty("$filter")) {
            const $supported = Abs.immutable(RENDERS.supports);
            if ($supported.contains($render)) {
                /*
                 * 支持
                 */
                const $filter = column['$filter'];
                if (Abs.isObject($filter)) {
                    const {type = "DIRECT"} = $filter;
                    if ("SEARCH" === type) {
                        /*
                         * 只有搜索类才会处理 highlight 专用
                         */
                        column.highlight = true;
                    }
                }
            } else {
                delete column['$filter'];
            }
        }

        column.render = executor(reference, column, ops);
    } else {
        console.error(`[ UxW ] 没有找到对应的 render 函数：${$render}`);
    }
}