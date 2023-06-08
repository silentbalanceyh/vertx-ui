import IN_HV_BY from './defence.@fn._.syntax.IN_HV_BY';
import IN_HV from './defence.@fn._.syntax.IN_HV';
import IN_H from './defence.@fn._.syntax.IN_H';
import OUT_H from './defence.@fn._.syntax.OUT_H';
import OUT_C from './defence.@fn._.syntax.OUT_C';

export default {
    // IN -> visitant -> dmRow ( With Filter )
    // HxAction
    IN_HV_BY,
    // IN -> visitant -> dmRow
    // HxQueue
    IN_HV,
    // IN -> view -> rows
    // HxMenu
    // HxSite
    IN_H,
    // OUT ---> $keySet
    OUT_H,
    // OUT ---> $keyChild
    OUT_C,
}