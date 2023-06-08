import __CONN from './form.equip.__.fn.raft.robin';
import __CPI from './form.equip.fn._.cab.cap.init';
import __UCA from './variant-uca/index.field.UNLOCK.DIALOG';

const I = {
    ...__CONN,
    ...__CPI,
}

const cabForm = (reference = {}, key = "form") =>
    I.cabForm(reference, key);

const configForm = (form, addOn = {}, containerFn) =>
    I.configForm(form, addOn, containerFn, __UCA);

const capForm = async (reference = {}, config = {}, program = {}) =>
    I.capForm(reference, config, program);

export default {
    cabForm,
    capForm,
    configForm
}