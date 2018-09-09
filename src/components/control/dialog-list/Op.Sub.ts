import Ux from 'ux';

const $opSubSave = (reference: any) => Ux.ai2Event(reference,
    (values) => {
        Ux.closeWindow(reference);
    });
/**
 * @param reference
 */
const $opSubAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => {
        Ux.closeWindow(reference);
    });
export default {
    $opSubSave,
    $opSubAdd
}