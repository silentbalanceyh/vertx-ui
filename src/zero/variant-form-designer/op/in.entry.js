import attribute from './in.__.fn.data.attribute'
import depend from './in.__.fn.data.depend';
import option from './in.__.fn.data.option';
import component from './in.e.__.fn.data.component';

import dataRules from './in.@fn._.data.rule';
import dataSelector from './in.@fn._.data.selector';

export default {
    ...attribute,
    ...depend,
    ...option,
    ...component,

    dataRules,
    dataSelector,
}