import Ux from 'ux';
import {Fn} from 'app';

const $opAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference)
        .response(values.version)
        .submitted()
        .reset()
        .to(() => Fn.demoJson(reference, 1, {version: values.version})));
const $opSave = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference)
        .response(values.version)
        .submitted()
        .reset()
        .to(() => Fn.demoJson(reference, 1, {version: values.version})));
export default {
    $opAdd,
    $opSave,
}