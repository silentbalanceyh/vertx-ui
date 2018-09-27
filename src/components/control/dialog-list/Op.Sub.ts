import Ux from 'ux';

const $opSubSave = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference).response(values).to());

const $opSubAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference).response(values).to());

export default {
    $opSubSave,
    $opSubAdd
}