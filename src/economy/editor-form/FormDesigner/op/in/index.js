import attribute from './I.attribute'
import depend from './I.depend';
import dataRules from './O.fn.rule';

export default {
    ...attribute,
    ...depend,
    dataRules,
}