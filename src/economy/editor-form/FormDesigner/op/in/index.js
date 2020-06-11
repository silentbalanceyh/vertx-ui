import attribute from './I.attribute'
import depend from './I.depend';

import component from './I.component';
import dataRules from './O.fn.rule';

export default {
    ...attribute,
    ...depend,
    ...component,
    dataRules,
}