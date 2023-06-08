import rxChannel from './aero.@fn.rx.channel.spread';
import func_areo_et_capture from './aero.fn.et.capture';
import func_areo_ac_criteria from './aero.fn.ac.criteria';

export default {
    rxChannel,
    // etUniform,
    // etSequence,
    // etParallel,
    // etPure
    ...func_areo_et_capture,
    // acCriteria
    ...func_areo_ac_criteria,
}