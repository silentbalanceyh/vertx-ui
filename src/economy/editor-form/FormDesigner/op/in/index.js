import attribute from './I.attribute'
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

    dataRules,
    dataSelector,
}