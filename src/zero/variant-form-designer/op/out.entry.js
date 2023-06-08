import attribute from './out.__.fn.data.attribute';
import depend from './out.__.fn.data.depend';
import option from './out.__.fn.data.option';
import component from './out.e.__.fn.data.component';

import dataRules from './out.@fn._.data.rule';
import dataSelector from './out.@fn.__.data.selector';

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