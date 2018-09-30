import Ux from 'ux';

const $opSubSave = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference).response(values).close().to());

const $opSubAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference).response(values).close().to());

export default {
    $opSubSave,
    $opSubAdd
}