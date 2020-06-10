import attribute from './I.attribute';
import depend from './I.depend';
import option from './I.option';
import component from './I.component';

import dataRules from './O.fn.rule';
import dataSelector from './O.fn.selector';

export default {
    ...attribute,
    ...depend,
    ...option,
    ...component,

    dataInit: (normalized = {}, params = {}) => {
        /*
         * normalized.field 可不设置
         * normalized.optionJsx 初始化
         * normalized.optionItem 初始化
         * normalized.optionConfig 初始化
         */
        normalized.optionJsx = {config: {}, depend: {}};
        normalized.optionItem = {};
        normalized.optionConfig = {};
    },
    /* rules, option 处理 */
    dataRules,
    dataSelector,
}