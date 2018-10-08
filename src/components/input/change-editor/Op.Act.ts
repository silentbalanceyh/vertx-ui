import Ux from 'ux';
import {Fn} from 'app';

const $opAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference)
        .response(values)
        .submitted()
        .reset()
        .to(() => Fn.demoJson(reference, 1, values)));
const $opSave = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference)
        .response(values)
        .submitted()
        .reset()
        .to(() => Fn.demoJson(reference, 1, values)));
export default {
    $opAdd,
    $opSave,
}