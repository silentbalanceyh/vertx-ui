import Ux from 'ux';
import {Fn} from 'app';

const getNormalized = (values: any = {}) => {
    if (values.approvalDate.date) {
        values.approvalDate.date =
            values.approvalDate.date.toISOString();
    }
    Ux.dgDebug(values, "提交数据");
    return values;
};

const $opAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference)
        .response(values)
        .submitted()
        .reset()
        .to(() => Fn.demoJson(reference, 1, getNormalized(values))));
const $opSave = (reference: any) => Ux.ai2Event(reference,
    (values) => Ux.rxAct(reference)
        .response(values)
        .submitted()
        .reset()
        .to(() => Fn.demoJson(reference, 1, getNormalized(values))));
export default {
    $opAdd,
    $opSave,
}